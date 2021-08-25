/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/**
* A parser error, handled internally by the ruleset and encounterManager
* classes.
*
* @memberof Faith.Encounter
*/
class ParserError extends Error {}
Object.defineProperty(ParserError.prototype, 'name', {
  value: 'ParserError',
});

/**
* The methods used in both encounterManager and ruleset parsers
*
* @mixin
* @memberof Faith.Encounter
*/
const parserMixin = {
	/**
	* Converts a Boolean string to true or false, or throws an error
	* if the string's value is different from 'true' or 'false'
	*
	* @private
	* @param {String} str - the string to be parsed
	*/
	_parseBoolean(str) {
		str = str.trim();
		switch(str) {
			case 'true':
				return true;
			case 'false':
				return false;
			case 'null':
				return null;
			default:
				this._throwParserError("Invalid string-based Boolean: "
					+ "expected 'true' or 'false', got '" + str + "'");
		}
	},

	/**
	* Parses the id of any entity that can have a numerical id,
	* converting that numerical id (if it exists) into the parent node's
	* id plus a suffix. 
	* 
	* @param {String} id - the entity's id
	* @param {String} parentId - the id of the entity's parent
	* @param {String} tag - the tag name of the entity, e.g. '<argument>'
	* or '<cost>'.
	* @return {String} the parsed id
	*/
	_parseId(id, parentId, tag) {
		id = id.trim();
		if (!id) {
			let errMsg = 'Id missing for entity or entityKind';
			if (parentNode)
				errMsg += ' included in parent ' + parentId;
			this._throwParserError(errMsg);
		}

		if (!isNaN(parseInt(id))) {
			// we have a numerical id
			return parentId + '-' + tag + '-' + id;
		} else {
			return id;
		}
	},

	/**
	* Parses the XML class list into a set (not array) of class names.
	*
	* @param {String} classes - the comma-separated list of classes
	* @return {Set} the set of class names
	*/
	_parseClasses(classes) {
		return new Set(classes.split(",").map((x)=>(x.trim())));
	},

	/**
	* Parses the given mode string, ensuring it takes the parent rule or
	* ruleset's value if the mode is missing. Modes for rules are either
	* 'replace', 'alter' or 'delete' and determine what should be done to
	* the previous instance of the same rule.
	* 
	* @param {String} mode - the mode string in question
	* @return {String} the parsed mode
	*/
	_parseMode(mode) {
		if (mode && mode !== 'replace' && mode !== 'alter'
				&& mode !== 'delete') {
			this._throwParserError(
				'Invalid mode attribute for rule; expected '
				+ "'replace', 'alter' or 'delete', got '"
				+ mode + "'."
			);
		}

		if (!mode) {
			if (this._ruleStack.length) {
				// set the mode to be its parent element's mode
				mode = this._ruleStack[this._ruleStack.length - 1]
					.mode;
			} else {
				// set the mode to be the ruleset's mode
				mode = this._mode;
			}
		}

		return mode;
	},

	/**
	* Throws a parser error, complete with xml file and DOM object context
	*
	* @private
	* @param {String} msg - the message supplied
	* @param {Boolean} [isWarning=false] - whether the error is simply
	* a warning
	*/
	_throwParserError(msg, isWarning=false) {
		if (isWarning && !this._displayWarnings)
			return;

		let dd = this._debugData;
		let context = dd.sourceText;
		let contextRuleset = null;
		let contextDisplayed = null;
		//[TODO] include different <conditions>
		let regExpRulePre = '<action|<and|<argument|<booster|'
			+ '<character|<condition|<cost|<effect|<encounter|'
			+ '<or|<property|<trait|<visibility';
			// (do not include a closing '>' as the element may have
			// attributes)
		let regExpRulePost = '</action>|</and>|</argument>|</booster>|'
			+ '</character>|</condition>|</cost>|</effect>|</encounter>|'
			+ '</or>|</property>|</trait>|</visibility>';

		let fullmsg = msg + '\n';

		if (this._debugData.fileName) {
			fullmsg += 'In ' + this._debugData.fileName + '\n';
		}

		// Display the rule stack
		let stackedRule;
		if (dd.kRuleset !== null && this._ruleStack.length) {
			for (let i = this._ruleStack.length - 1; i >= 0; i--) {
				stackedRule = this._ruleStack[i];
				fullmsg += 'In <' + stackedRule.kind
					+ '> ' +  (stackedRule.id ?? '(no id)') + '\n'
			}
		}

		// include the line number and optionally the context data
		// in the error message
		if (context && dd.kRuleset !== null) {
			let nPaddingCharsPre = 30;
			let nPaddingCharsPost = 80;
				// (the number of characters to show from the context text
				// in front of and after the current ruleset or rule)

			//we have a ruleset and XML string for the set of rulesets;
			//find the target ruleset, indexed at kRuleset

			let index = -1;
			//find the index of the current ruleset in the source string
			for (let iRuleset = 0; iRuleset <= dd.kRuleset; iRuleset++) {
				index = context.indexOf('<ruleset>', index + 1);
			}
			let indexPost = context.indexOf('</ruleset>', index) + 10;
			
			let indexRuleset = index;
			contextRuleset = context.slice(index, indexPost);
		
			if (this._ruleStack.length) {
				//find the index of the current rule in the source string
				index = 0;
				stackedRule = this._ruleStack[this._ruleStack.length - 1];

				for (let iRule = 0; iRule <= stackedRule.kRule; iRule++) {
					index += 1 + contextRuleset.slice(index)
						.search(new RegExp(regExpRulePre
							+ "|<" + stackedRule.kind + ">", 'm'));
						// 'm' stands for 'multiline'

						// adding the rule's kind in the event that it's
						// an invalid, malformed kind that's throwing the
						// error
				}
				// added 1 to the index before to make it search from
				// right after the start of the currently found XML tag,
				// so as not to consider the currently found XML tag
				// a match. now subtract 1 to place it right at the 
				// start of the currently found XML tag.
				index -= 1;
				
				//indexPost = contextRuleset.slice(index + 1)
				//	.search(new RegExp(regExpRulePost
				//		+ "|<" + stackedRule.kind + ">"));
			}

			let lineIndex = -1;
			let lineNumber = 0;
			while (lineIndex < index + indexRuleset) {
				lineIndex = context.indexOf('\n', lineIndex + 1);
				if (lineIndex !== -1) {
					lineNumber++;
				}
			}
			fullmsg += 'Element with error in line ' + lineNumber
				+ ' of source text. \n';

			if (this._displayContextOnErrors) {
				let indexDisplayedPre =
						Math.max(index - nPaddingCharsPre, 0);
				let ellipsesDisplayedPre = 
					(index - nPaddingCharsPre <= 0) ? '' : '...'
				let indexDisplayedPost =
						Math.min(index + nPaddingCharsPost,
						context.length)						
				let ellipsesDisplayedPost = 
							(index + nPaddingCharsPost >= context.length)
							? '' : '...';

				if (this._displayContextPadded) {
					// extract the context string for the rule containing a
					// small portion of the exterior elements
					contextDisplayed =
						ellipsesDisplayedPre
						+ context.slice(
							indexDisplayedPre,
							indexDisplayedPost
						) + ellipsesDisplayedPost;
				} else {
					// extract the context string for the rule containing
					// none of the exterior elements
					contextDisplayed = context.slice(
						index, indexDisplayedPost)
						+ ellipsesDisplayedPost;
				}
				fullmsg += '\nContext:\n' + contextDisplayed;
			}
		}

		// display the DOM
		if (this._displayDomOnErrors) {
			if (this._ruleStack.length) {
				fullmsg += '\nError in rule: '
					+ this._ruleStack[this._ruleStack.length - 1];
				fullmsg += '\nRule stack: ' + this._ruleStack;
			}
			if (dd.ruleset) {
				fullmsg + '\nRuleset:' + dd.ruleset;
			}
		}

		//console.log(fullmsg);
		
		if (isWarning) {
			if (this._raiseAlertOnWarnings
					&& typeof alert !== 'undefined') {
				alert(fullmsg);
			}
			console.warn(fullmsg);
		} else {
			if (this._raiseAlertOnErrors
					&& typeof alert !== 'undefined') {
				alert(fullmsg);
			}
			throw new ParserError(fullmsg);
		}
	},
}

export { ParserError, parserMixin }
