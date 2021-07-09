/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { Action, ActionKind } from './action.js';
import { Argument, ArgumentKind } from './argument.js';
import { Booster, BoosterKind } from './booster.js';
import { Character, CharacterKind } from './character.js';
import { Effect, EffectKind } from './effect.js';
import { Trait, TraitKind } from './trait.js';

import { _parseVisibility, _visTopLevel } from './ruleset2.js';
import List from './list.js';

/**
* The configuration object used when creating the ruleset.
* @typedef {object} Faith.Encounter.rulesetConfig
* 
* @property {Boolean} displayDomOnErrors - Whether to display the XML DOM
* element that features the error when throwing errors and warnings.
*
* @property {Boolean} displayContextOnErrors - 
* Whether the ruleset displays the context of an xml error
* (or warning). The context will show the xml element that has
* the problem as well as some of the text before and after the
* xml element in the xml file, for ease of searching.
*
* @property {Boolean} displayContextPadded - 
* Whether, when an error or warning occurs, to display the padded
* context, which includes parts of the previous and next XML
* elements, as part of displaying the context of the error,
* which will always include the XML element affected by the error.
*
* @property {Boolean} displayWarnings - 
* Whether to display warnings when they occur.
*
* @property {Boolean} raiseAlertOnErrors - 
* Whether the ruleset raises an alert on errors.
* 
* @property {Boolean} raiseAlertOnWarnings - 
* Whether the ruleset raises an alert on warnings.
*/
const rulesetConfig = {
	displayDomOnErrors: true,
	displayContextOnErrors: true,
	displayContextPadded: true,
	displayWarnings: true,
	raiseAlertOnErrors: true,
	raiseAlertOnWarnings: true,
}

/**
* A ruleset, parsed from one or more xml files, containing all the rules
* for social encounters.
*
* Xml files containing rules must specify the different kinds of actions,
* arguments, boosters, characters, character traits, encounter traits etc.
* (i.e. all the different game entity kinds). They do not need to contain
* rules for the 'action-create-argument', 'action-create-booster',
* 'action-develop-argument' and 'action-retarget-argument' action kinds,
* but may overwrite the rules for these.
* 
* To see the structure of the xml element corresponding to a given game
* entity kind, check the entityKind's class in the docs (e.g.
* Faith.Encounter.Argument or Faith.Encounter.Action).
* 
* When a rules xml file is parsed, if a rule previously existed for a game
* entity kind with the same ID, and the mode="alter" attribute is set for
* the entity kind, the rule is partially overwritten so that the new
* rule's contents replace those of the old. This allows, for instance, a
* mod to replace the cost of an action while leaving the rest of the
* action unchanged.
*
* @memberof Faith.Encounter
*/
class Ruleset {
	/**
	* Parses the specified xml-containing strings or xml documents into
	* the rules they describe, thus creating the ruleset
	*
	* @param {...XMLDocument|string} xml - a string or XML document to be
	* parsed
	*/
	constructor(config, ...args) {
		/**
		* Whether the ruleset displays the XML DOM element that features
		* the error when throwing parser errors and warnings.
		*
		* @private
		* @type {Boolean}
		* @default true
		*/
		this._displayDomOnErrors = config.displayDomOnErrors ?? true;

		/**
		* Whether the ruleset displays the context of an xml error
		* (or warning). The context will show the xml element that has
		* the problem as well as some of the text before and after the
		* xml element in the xml file, for ease of searching.
		*
		* @private
		* @type {Boolean}
		* @default true
		*/
		this._displayContextOnErrors =
			config.displayContextOnErrors ?? true;

		/**
		* Whether, when an error or warning occurs, to display the padded
		* context, which includes parts of the previous and next XML
		* elements, as part of displaying the context of the error,
		* which will always include the XML element affected by the error.
		* 
		* @private
		* @type {Boolean}
		* @default true
		*/
		this._displayContextPadded = config.displayContextPadded ?? true;

		/**
		* Whether to display warnings when they occur.
		*
		* @private
		* @type {Boolean}
		* @default true
		*/
		this._displayWarnings = config.displayWarnings ?? true;

		/**
		* Whether the ruleset raises an alert on errors.
		*
		* @private
		* @type {Boolean}
		* @default true
		*/
		this._raiseAlertOnErrors = config.raiseAlertOnErrors ?? true;

		/**
		* Whether the ruleset raises an alert on warnings.
		*
		* @private
		* @type {Boolean}
		* @default true
		*/
		this._raiseAlertOnWarnings = config.raiseAlertOnWarnings ?? true;

		/**
		* The list of all entity kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.EntityKind>}
		*/
		this.all = new List();

		/**
		* The list of action kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.ActionKind>}
		*/
		this.actions = new List();	

		/**
		* The list of argument kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.ArgumentKind>}
		*/
		this.args = new List();

		/**
		* The list of argument trait kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.TraitKind>}
		*/
		this.argTraits = new List();

		/**
		* The list of booster kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.BoosterKind>}
		*/
		this.boosters = new List();

		/**
		* The list of character kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.CharacterKind>}
		*/
		this.chars = new List();

		/**
		* The list of character trait kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.TraitKind>}
		*/
		this.charTraits = new List();

		/**
		* The list of cost templates, storing all the costs with a
		* non-numerical id that are part of this ruleset. Used in
		* creating child costs via <copyById></copyById>, which copies
		* the data from a template with a given id to the game entity
		* encapsulating the <copyById> tag.
		* 
		* @type {Faith.Encounter.List<Faith.Encounter.Cost>}
		*/
		this.costTemplates = new List();

		//[TODO] Copy multiple templates by id into the same game entity

		/**
		* The list of condition templates, storing all the conditions
		* with a non-numerical id that are part of this ruleset. Used in
		* creating child conditions as with the costTemplates member.
		*
		* @type {Faith.Encounter.List<Faith.Encounter.Condition>}
		*/
		this.condTemplates = new List();
		//[TODO] change Faith.Encounter.Condition if appropriate

		/**
		* The list of effect kinds in this ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.EffectKind>}
		*/
		this.effects = new List();

		/**
		* The list of encounter kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.EncounterKind>}
		*/
		this.encounters = new List();

		/**
		* The list of encounter trait kinds in this ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.TraitKind>}
		*/
		this.encounterTraits = new List();

		/**
		* The list of researchable entities in the game.
		* Access the nth tier, which is a Faith.Encounter.List,
		* using research.tier[n-1] .
		* Access the untiered researchables using research.untiered .
		*
		* @type <object>
		*/
		this.research = {tier: [], untiered: new List()}

		for	(let arg of args) {
			this.addXml(arg);
		}
	}

	/**
	* Whether visibility rules are ignored and everything is visible.
	* Set this to true to disable visibility rules.
	*
	* @type {Boolean}
	* @default false
	*/
	allVisible = false;

	/**
	* Whether to ignore the default rules for probing and secrecy in this
	* ruleset. Setting this to true without providing alternative rules
	* for probing will make many things permanently unknown unless
	* allVisible is set to 'true'.
	*
	* @type {Boolean}
	* @default false
	*/
	overrideDefaultProbing = false;

	/**
	* The visibility rules for the encounter. Refer to the manual
	* (README.md) for details.
	*/
	vis = _visTopLevel;
	/**
	* Adds the specified entity kind or entity kinds to the ruleset.
	*
	* @example
	* ruleset.add(entityKind1, entityKind2, entityKind3);
	*
	* @param {...Faith.Encounter.ActionKind
	* |Faith.Encounter.ArgumentKind
	* |Faith.Encounter.BoosterKind
	* |Faith.Encounter.CharacterKind
	* |Faith.Encounter.EffectKind
	* |Faith.Encounter.EncounterKind
	* |Faith.Encounter.TraitKind
	* } entityKinds - the entity kinds to be added
	*/
	add(...entityKinds) {
		//[TODO] edit this after adding more lists

		// First check that the id of the entity kind to be added
		// does not clash with those of other entity kinds
		for (let entityKind of entityKinds) {
			for (let otherKind of this.all) {
				if (otherKind.id === entityKind.id) {
					throw 'Invalid id for entityKind ' + entityKind.id
						+ ' as it matches the id of another entityKind '
						+ ' in the ruleset.'
				}
			}

			if (entityKind instanceof ActionKind) {
				this.actions.add(entityKind);
			} else if (entityKind instanceof ArgumentKind) {
				this.args.add(entityKind);
			} else if (entityKind instanceof BoosterKind) {
				this.boosters.add(entityKind);
			} else if (entityKind instanceof CharacterKind) {
				this.chars.add(entityKind);
			//[TODO]
			//} else if (entityKind instanceof EffectKind) {
			//	this.effects.add(entityKind);
			} else if (entityKind instanceof EncounterKind) {
				this.encounters.add(encounterKind);
			} else if (entityKind instanceof TraitKind) {
				//[TODO]
			} else {
				throw 'Invalid entity kind ' + entityKind.id
					+ ' to be added to the ruleset. Must be '
					+ 'an ActionKind, an ArgumentKind, '
					+ 'a BoosterKind, a CharacterKind, an EffectKind, '
					+ 'an EncounterKind or a TraitKind.'
				; //[TODO]
			}
			this.all.add(entity);
		}
	}

	/**
	* Removes the specified entity kind or kinds from the ruleset.
	*
	* @example
	* ruleset.remove(entityKind1, entityKind2, entityKind3);
	*
	* @param {...Faith.Encounter.ActionKind
	* |Faith.Encounter.ArgumentKind
	* |Faith.Encounter.BoosterKind
	* |Faith.Encounter.CharacterKind
	* |Faith.Encounter.EffectKind
	* |Faith.Encounter.EncounterKind
	* |Faith.Encounter.TraitKind
	* } entityKinds - the entityKinds to be removed
	*/
	remove(...entityKinds) {
		//[TODO] edit this after adding more lists
		for (let entityKind of entityKinds) {
			if (entityKind instanceof ActionKind) {
				this.actions.remove(entityKind);
			} else if (entityKind instanceof ArgumentKind) {
				this.args.remove(entityKind);
			} else if (entityKind instanceof BoosterKind) {
				this.boosters.remove(entityKind);
			} else if (entityKind instanceof CharacterKind) {
				this.chars.remove(entityKind);
			//[TODO]
			//} else if (entityKind instanceof EffectKind) {
			//	this.effects.remove(entityKind);
			} else if (entityKind instanceof EncounterKind) {
				this.encounters.remove(entityKind);
			} else if (entityKind instanceof TraitKind) {
				//[TODO] account for different trait Lists; also ensure
				// that the loops skips over this entity if it is not found
			} else {
				throw 'Invalid entity kind to be removed: must be an '
					+ 'Action, Argument, Booster, Character, Effect or '
					+ 'Trait.';
			}
			this.all.remove(entityKind);
		}
	}

	/**
	* Adds the xml data from the specified source to the ruleset.
	*
	* @param {String|XMLDocument} source - the source of the XML data,
	* either a string containing the data or an actual XMLDocument.
	* @return {Faith.Encounter.Ruleset} the ruleset itself.
	*/
	parse(source) {
		let xml;
		if (source instanceof String) {
			let parser = new DOMParser();
			this._debugData.sourceText = source;
			xml = parser.parseFromString(source, 'text/xml');
			this._debugData.xml = xml;
		} else if (source instanceof XMLDocument) {
			this._debugData.sourceText = '';
			xml = source;
			this._debugData.xml = xml;
		} else {
			this._throwParserError('Invalid XML rule source, cannot add '
				+ 'to ruleset. please ensure that the rule source is a '
				+ 'String or an XMLDocument.');
		}

		//[TODO] handle ruleset-specific modes, e.g. <ruleset mode="alter">
		//[TODO] only add the entityKind if it is new or if its mode is
		//set to 'replace' (in which case the old entityKind gets deleted).
		//[TODO] assign the entityKind to its research tier if not
		// already there
		//[TODO] pop the rule out of the debug rulestack before returning
		// from the rule's parsing method
		let rulesets = xml.getElementsByTagName('ruleset')
		if (!rulesets.length) {
			this._throwParserError('Xml rule source does not contain '
				+ 'any rulesets.',
				isWarning = true);
		}

		for (let kRuleset = 0; kRuleset < rulesets.length; kRuleset++) {
			this._ruleStack = [];
			let ruleset = rulesets[kRuleset];

			this._debugData = {sourceText: null, xml: null, kRuleset: null,
				ruleset: null};
			this._debugData.kRuleset = kRuleset;
			this._debugData.ruleset = ruleset;

			let isWipe = ruleset.getAttribute('wipe') === 'all'
				? true : false;
			let rules = ruleset.childNodes;
			if (!rules.length) {
				this._throwParserError('Xml ruleset does not contain any '
					+ 'rules.',
					isWarning = true);
			}

			if (isWipe) {
				//wipe the ruleset's data
				//[TODO] edit this after adding more lists
				this.all = new List();
				this.args = new List();
				this.actions = new List();
				this.argTraits = new List();
				this.boosters = new List();
				this.chars = new List();
				this.charTraits = new List();
				this.costTemplates = new List();
				this.condTemplates = new List();
				this.effects = new List();
				this.encounters = new List();
				this.encounterTraits = new List();
				this.research = {tier: [], untiered: new List()};
			}

			// store the ruleset's mode
			let mode = ruleset.getAttribute('mode');
			if (!mode) {
				this._mode = 'replace';
			} else {
				if (mode !== 'replace' && mode !== 'alter'
						&& mode !== 'delete') {
					this._throwParserError(
						'Invalid mode attribute for ruleset; expected '
						+ "'replace', 'alter' or 'delete', got '"
						+ mode + "'."
					);
				}

				this._mode = mode;
			}

			this._debugData.kRule = 0;
				// (this also counts rules within other rules, for instance
				// rules for traits, conditions and costs)
			for (let iRule = 0; iRule < rules.length; iRule++) {
				let rule = rules[iRule];
				let kind = rule.tagName;

				// [WARNING] do not replace this with this._parseId()!
				// All top-level rules must have an id; entities must have
				// an id by default, and top-level costs, effects and
				// conditions must have ids in order to be referenced by
				// entities that copy from them, as they are
				// templates.
				if (!rule.id) {
					this._throwParserError(
						'top-level rule is missing an id');
				} else if (!isNaN(parseInt(rule.id))) {
					this._throwParserError(
						'invalid top-level rule: should be '
						+ 'a string of words separated by hyphens, '
						+ 'got a number instead');
				}

				mode = this._parseMode(rule.getAttribute('mode'));

				let stackedRule = {
					rule: rule,
					kind: kind,
					id: rule.id,
					mode: mode,
					kRule: this._debugData.kRule,
				};
				this._ruleStack.push(stackedRule);

				switch (kind) {
					case 'action':
						this._parseAction(rule, mode);
						break;
					case 'argument':
						this._parseArgument(rule, mode);
						break;
					case 'booster':
						this._parseBooster(rule, mode);
						break;
					case 'character':
						this._parseCharacter(rule, mode);
						break;
					case 'cost':
						this._parseCost(rule, null, mode);
							// (rule, holder, mode)
						break;
					case 'effect':
						this._parseEffect(rule, null, mode);
							// (rule, holder, mode)
						break;
					case 'encounter':
						this._parseEncounter(rule, mode);
						break;
					case 'existsCondition':
						this._parseExistsCondition(rule, null, mode);
							// (rule, holder, mode)
						break;
					case 'trait':
						this._parseTrait(rule, null, mode);
							// (rule, holder, mode)
						break;
					case 'visibility':
						this._parseVisibility(rule, null, mode);
							// (rule, holder, mode)
					default:
						this._throwParserError(
							'Invalid rule tag. Expected tag name '
							+ ' to be \'action\', \'booster\' etc. '
							+ '(without quotes), got ' + tagName
							+ ' instead.');
				}
				this._debugData.kRule++;
			
				//reset the rulestack
				this._ruleStack = [];
			}
		}
		return this;
	}

	validate() {
		let entityKind;
		//validate all game entity kinds' individual data members
		for (entityKind of this.all) {
			entityKind.validate();
		}

		// check that no two entity kinds have the same id
		for (let i = 0; i < this.all.list.length; i++) {
			entityKind = this.all.list[i];
			for (let j = i + 1; j < this.all.list.length; j++) {
				if (this.all.list[j].id === entityKind.id) {
					throw 'Entity kind number ' + i + ' and game entity '
						+ 'number ' + j + ' in the ruleset have the same '
						+ 'id, ' + entity.id + ' . Please give '
						+ 'each type of argument, booster etc. an '
						+ 'id that is unique among all game entities ('
						+ 'an argument and a booster cannot share the '
						+ 'same id). Separate the words in the id with '
						+ 'hyphens (-), i.e. use kebab-case.';
				}
			}
		}
	}

	/**
	* The currently parsed ruleset's global mode, i.e. 'replace', 'alter'
	* or 'delete'.
	* 
	* @private
	* @type {String}
	* @default 'replace'
	*/
	_mode = 'replace';

	//[TODO] Check with jsdoc whether the properties are rendering
	// correctly
	/**
	* An array holding the rules currently being parsed, starting from the
	* outermost rule (e.g. <encounter></encounter>) and ending with the
	* innermost rule (e.g. <cost></cost>). Each object in the rulestack
	* has the following properties:
	* 
	* @private
	* @property {object} xml - the XML node of the given rule
	* @property {String} kind - the `kind` of the given rule,
	* e.g. 'action', 'booster', 'cost' or 'condition'
	* @property {String} id - the id of the given rule
	* @property {String} mode - the mode of the given rule, e.g.
	* 'replace', 'alter', 'delete'. Affects how the rule will treat
	* previous instances of itself.
	* @property {number} kRule - the number of rule starting tags (e.g.
	* <action>, <cost>) in the source string up to the given rule's
	* starting tag; used for debugging
	*/
	_ruleStack = [];

	//[TODO] Check with jsdoc whether the properties are rendering
	// correctly
	/**
	* Data stored internally to provide accurate error messages
	*
	* @private
	* @type {object}
	* @property {String|null} sourceText - the source text string of the XML
	* document parenting the XML rulesets to be parsed
	* @property {XMLDocument|null} xml - the XML document parenting the XML
	* rulesets to be parsed
	* @property {number|null} kRuleset - the number of <ruleset> tags
	* encountered up to the current <ruleset> tag in the source string
	* @property {object} ruleset - the XML ruleset
	*/
	_debugData = {sourceText: null, xml: null, kRuleset: null,
		ruleset: null};

	/**
	* Copy the contents of an already-existent action into another
	* already-existent action, overwriting only its null contents.
	*
	* @private
	* @param {Faith.Encounter.Action} source - the source to be copied
	* @param {Faith.Encounter.Action} target - the target to be copied into
	*/

	_copyAction(source, target) {
		//[TODO] <copyById></copyById>

	}


	/**
	* Checks if all the classes in the two class lists are the same.
	*
	* @param {Set} classList1 - the first list of class names
	* @param {Set} classList2 - the second list of class names
	* @return {Boolean} the result of the check
	*/
	_checkClassesSame(classList1, classList2) {
		if (classList1.size !== classList2.size)
			return false;

		for (let cls1 of classList1) {
			let found = false;
			for (let cls2 of classList2) {
				if (cls1 === cls2) {
					found = true;
					break;
				}
			}
			if (!found)
				return false;
		}
		return true;
	}

	/**
	* Parse an action from its XML DOM element.
	*
	* @private
	* @param {object} rule - the XML-based action rule to be parsed
	*/
	_parseAction(rule) {
		
	}

	/**
	* Converts a Boolean string to true or false, or throws an error
	* if the string's value is different from 'true' or 'false'
	*
	* @private
	* @param {String} str - the string to be parsed
	*/
	_parseBoolean(str) {
		switch(str) {
			case 'true':
				return true;
			case 'false':
				return false;
			default:
				this._throwParserError("Invalid string-based Boolean: "
					+ "expected 'true' or 'false', got '" + str + "'");
		}
	}

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
		if (!id) {
			let errMsg = 'Id missing for rule';
			if (parentNode)
				errMsg += ' included in rule ' + parentId;
			this._throwParserError('Id missing for rule');
		}

		if (!isNaN(parseInt(id))) {
			// we have a numerical id
			return parentId + '-' + tag + '-' + id;
		} else {
			return id;
		}
	}

	/**
	* Parses the XML class list into a set (not array) of class names.
	*
	* @param {String} classList - the comma-separated list of classes
	* @return {Set} the set of class names
	*/
	_parseClasses(classList) {
		return Set(classList.split(",").map((x)=>(x.trim())));
	}

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
	}

	/**
	* Parse a visibility rule from its XML DOM element
	* 
	* @private
	* @method
	* @param {object} rule - the XML-based visibility rule to be parsed
	*/
	_parseVisibility = _parseVisibility;

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

		let nPaddingChars = 60;
			// (the number of characters to show from the context text
			// in front of and after the current ruleset or rule)

		let dd = this._debugData;
		let context = dd.sourceText;
		let contextRuleset = null;
		let contextDisplayed = null;
		//[TODO] include different <conditions>
		let regExpRulePre = new RegExp('<action>|<argument>|<booster>|'
			+ '<character>|<condition>|<cost>|<effect>|<encounter>|'
			+ '<property>|<trait>|<visibility>');
		let regExpRulePost = new RegExp('</action>|</argument>|</booster>|'
			+ '</character>|</condition>|</cost>|</effect>|</encounter>|'
			+ '</property>|</trait>|</visibility>');

		let fullmsg = msg + '\n';

		// Display the rule stack
		let stackedRule;
		if (dd.kRuleset !== null && this._ruleStack.length) {
			for (let i = this._ruleStack.length - 1; i > 0; i++) {
				stackedRule = this._ruleStack[i];
				fullmsg += 'In ' + stackedRule.kind
					+ ' ' +  stackedRule.id + '\n'
			}
			fullmsg += '\n';
		}

		if (this._displayContextOnErrors && context
				&& dd.kRuleset !== null) {
			//we have a ruleset and XML string for the set of rulesets;
			//find the target ruleset, indexed at kRuleset

			let index = 0;
			//find the index of the current ruleset in the source string
			for (let iRuleset = 0; iRuleset <= dd.kRuleset; iRuleset++) {
				index = context.indexOf('<ruleset>', index + 1);
			}
			let indexPost = context.indexOf('</ruleset>', indexPre) + 10;
			
			contextRuleset = context.slice(index, indexPost + 10);
				//+10 because we include the </ruleset> tag
			
			//find the index of the current rule in the source string
			if (this._ruleStack.length) {
				index = 0;
				stackedRule = this._ruleStack[this._ruleStack.length - 1];
				for (let iRule = 0; iRule <= stackedRule.index; iRule++) {
					index = contextRuleset.slice(index + 1)
						.search(regExpRulePre);	
				}
				
				//indexPost = contextRuleset.slice(index + 1)
				//	.search(regExpRulePost);

				if (this._displayContextPadded) {
					// extract the context string for the rule containing a
					// small portion of the exterior elements
					contextDisplayed = '...' + context.slice(
						max(index - nPaddingChars, 0),
						min(index + nPaddingChars + 1, context.length)
						) + (index + nPaddingChars + 1 >= context.length)
							? '' : '...';
				} else {
					// extract the context string for the rule containing
					// none of the exterior elements
					contextDisplayed = context.slice(
						index,
						index + max(nPaddingChars + 1, context.length)
						) + (index + nPaddingChars + 1 >= context.length)
						? '' : '...';
				}
			} else {
				if (this._displayContextPadded) {
					// extract the context string for the ruleset
					// containing a small portion of the exterior elements
					contextDisplayed = '...' + context.slice(
						max(index - nPaddingChars, 0),
						min(index + nPaddingChars + 1, context.length)
						) + (index + nPaddingChars + 1 >= context.length)
						? '' : '...';

					fullmsg += '\n\nContext:\n' + contextDisplayed;
				} else {
					// extract the context string for the ruleset
					// containing none of the exterior elements
					contextDisplayed = context.slice(
						index, 
						index + max(nPaddingChars + 1, context.length), 
					) + (index + nPaddingChars + 1 >= context.length)
					? '' : '...';
				}
			}
			fullmsg += '\n\nContext:\n' + contextDisplayed;
		}

		// display the DOM
		if (this._displayDomOnErrors) {
			if (this._ruleStack.length) {
				fullmsg += '\n\nError in rule: '
					+ this._ruleStack[this._ruleStack.length - 1];
				fullmsg += '\n\nRule stack: ' + this._ruleStack;
			}
			if (dd.ruleset) {
				fullmsg + '\n\nRuleset:' + dd.ruleset;
			}
		}
		
		if (isWarning) {
			if (this._raiseAlertOnWarnings) {
				alert(fullmsg);
			}
			console.warn(fullmsg);
		} else {
			if (this._raiseAlertOnErrors) {
				alert(fullmsg);
			}
			throw fullmsg;
		}
	}
}
export { Ruleset };

