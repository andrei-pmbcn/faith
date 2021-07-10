//[TODO] parse visibility for traits

function _parseVisibility(rule, holder, mode) {
	if (!holder) {
		// we have a top-level visibility rule

		// if the rule has 'allVisible="true"', it will tell the ruleset
		// to ignore visibility rules altogether and treat everything as
		// visible
		if (rule.getAttribute('allVisible') === 'true') {
			this.allVisible = true;
		} else {
			this.allVisible = false;
		}
		// if the rule has an overrideDefaultProbing attribute,
		// use it to determine whether the default probing rules
		// will apply to this ruleset
 		if (rule.getAttribute('overrideDefaultProbing') === 'true') {
			this.overrideDefaultProbing = true;
		} else if (rule.getAttribute('overrideDefaultProbing')
				=== 'false') {
			this.overrideDefaultProbing = false;
		}

		if (mode === 'replace' || mode === 'delete') {
			this.vis = new _VisTopLevel();
		}

		if (mode !== 'delete') {
			for (let i = 0; i < rule.childNodes.length; i++) {
				let child = rule.childNodes[i];
				if (child.nodeType !== child.ELEMENT_NODE)
					continue;

				let childMode = this._parseMode(child.getAttribute('mode'));
				this._debugData.kRule++;

				//add the child visibility rule to the ruleStack
				let stackedRule = {
					rule: child,
					kind: child.tagName,
					id: null,
					mode: childMode,
					kRule: this._debugData.kRule,
				};
				this._ruleStack.push(stackedRule);

				switch (child.tagName) {
					case 'argument':
						break;
					case 'booster':
						break;
					case 'character':
						break;
					case 'item':
						break;
					case 'encounter':
						_parseVisibilityEncounter.bind(this)
							(child, this, childMode, true);
						break;
					case 'property':
						break;
					case 'trait':
						break;
					default:
						this._throwParserError(
							"Invalid tag name for child of top-level "
							+ "visibility element: must be '<encounter>', "
							+ "'<argument>', '<booster>', '<character>', " 
							+ "'<property>' or '<trait>'; got tag name '<"
							+ child.tagName + ">'"
						);
				}
			}
		}
	} else {
		let newVis;
		if (mode === 'replace' || mode === 'delete') {
			holder.vis = JSON.parse(JSON.stringify(
				_visSpecific[holder.tagName]));
		}

		if (mode !== 'delete') {
			switch (holder.tagName) {
				case 'action':
					//[TODO]
					break;
				case 'argument':
					break;
				case 'booster':
					break;
				case 'character':
					break;
				case 'item':
					break;
				case 'encounter':
					_parseVisibilityEncounter.bind(this)
						(rule, holder, mode, false);
					break;
				case 'trait':
					break;
				default:
					this._throwParserError(
						"Invalid holder type for visibility rule; "
						+ "expected '<action>', '<argument>', "
						+ "'<booster>', '<character>', '<encounter>' "
						+ "or '<trait>', got " + holder.tagName
				);
			}
		}
	}
}

/* Undocumented function
* Every _parseVisibility* function will run _processParsedRule after it
* has finished everything else, in order to add the parsed rule to the
* javascript ruleset's visibility rules.
*
* @param {object} parsedRule - the object storing the visibility rule
* @param {String} collection - the type of rule that has been parsed,
* e.g. 'argument', 'character', 'encounter'
* @param {object} holder - the object that holds the visibility rules
* @param {String} mode - the rule's mode, i.e. whether the rule will
* replace, alter or delete its previous instance if that instance exists
* @param {Boolean} isTopLevel - whether the parsed rule is a top-level
* rule, located in the <visibility> element that sits directly inside
* the <ruleset> element.
*/
function _processParsedRule(parsedRule, collection, rule, holder, mode,
		isTopLevel) {
	if (!parsedRule.classes)
		parsedRule.classes = new Set();
	if (!parsedRule.id)
		parsedRule.id = null;
	parsedRule.propList = [];
	
	//parse the visibility rules for the child property kinds
	_parseVisibilityInProperties.bind(this)(rule, parsedRule.propList, mode)

	if (isTopLevel && !parsedRule.classes.size && !parsedRule.id
			&& mode === 'replace') {
		// fill in from the default encounter visibility rule,
		// as we will replace it
		let defaultRule = _visTopLevelCreator[collection]();
		for (let attr in defaultRule) {
			// fill in the missing default rules
			if (Object.keys(parsedRule).indexOf(attr) === -1)
				parsedRule[attr] = defaultRule[attr]
		}
	}

	// transfer properties from the parsedRule to the oldRule
	function transferProperties(parsedRule, oldRule) {
		for (let parsedProp of parsedRule.propList) {
			// check if the property rule exists inside the oldRule
			let foundProp;
			for (let oldProp of oldRule.propList) {
				let noIdsNoClasses = !oldProp.id && !parsedProp.id
					&& !oldProp.classes.size && !parsedProp.classes.size;
				let sameIds = oldProp.id && parsedProp.id
					&& oldProp.id === parsedProp.id;
				let noIdsSameClasses = !oldProp.id && !parsedProp.id
					&& this._checkClassesSame(
					oldProp.classes, parsedProp.classes)

				if (noIdsNoClasses || sameIds || noIdsSameClasses) {
					foundProp = oldProp;
					break;
				}
			}
			if (foundProp) {
				if (parsedProp.mode === 'replace') {
					// remove the old property from its propList
					oldRule.propList.splice(oldRule.propList.indexOf(
						foundProp), 1);
					// add the new property to the propList
					oldRule.propList.push(parsedProp);
				} else if (parsedProp.mode === 'alter') {
					for (let attr in parsedProp) {
						foundProp[attr] = parsedProp[attr];
					}
				} else if (parsedProp.mode === 'delete') {
					// remove the old property from its propList
					oldRule.propList.splice(oldRule.propList.indexOf(
						foundProp), 1);
				}
			} else {
				if (parsedProp.mode === 'replace'
						|| parsedProp.mode === 'alter') {
					oldRule.propList.push(parsedProp);
				}
			}
		}
	}

	//we have the parsed rule, now see what to do with the old rule
	let oldRule;

	if (isTopLevel) {
		// The visibility rule is a top-level rule, so check all the
		// encounter rules in this.vis and see which one matches, if any.
		for (let visRule of this.vis[collection]) {
			let noIdsNoClasses = !visRule.id && !parsedRule.id
				&& !visRule.classes.size && !parsedRule.classes.size;
			let sameIds = visRule.id && parsedRule.id
				&& visRule.id === parsedRule.id;
			let noIdsSameClasses = !visRule.id && !parsedRule.id
				&& this._checkClassesSame(
				visRule.classes, parsedRule.classes)

			if (noIdsNoClasses || sameIds || noIdsSameClasses) {
				oldRule = visRule;
				break;
			}
		}
		if (!oldRule) {
			if (mode === 'replace' || mode === 'alter') {
				this.vis[collection].push(parsedRule);
			}
		} else {
			if (mode === 'replace') {
				// remove the previous instance of the rule
				this.vis[collection].splice(
					this.vis[collection].indexOf(oldRule), 1);
				// add the new instance of the rule 
				this.vis[collection].push(parsedRule);
			} else if (mode === 'alter') {
				// replace the attributes to be modified one by one
				for (let attr in parsedRule) {
					if (attr !== 'propList') {
						oldRule[attr] = parsedRule[attr];
					} else {
						transferProperties(parsedRule, oldRule);
					}
				}
			} else if (mode === 'delete') {
				// remove the previous instance of the rule
				this.vis[collection].splice(
					this.vis[collection].indexOf(oldRule), 1);

				if (!this.vis[collection].length) {
					// We removed the default visibility rule,
					// put it back on
					this.vis[collection] =
						[_visTopLevelCreator[collection]()];
				}
			}
		}
	} else {
		// The visibility rule is a kind-specific rule, so address its
		// holder's vis attribute directly.
		if (mode === 'replace') {
			holder.vis = parsedRule;
		} else if (mode === 'alter') {
			for (let attr in parsedRule) {
				if (attr !== 'propList') {
					holder.vis[attr] = parsedRule[attr];
				} else {
					transferProperties(parsedRule, holder.vis);
				}
			}
		} else if (mode === 'delete') {
			holder.vis = null;
		}
	}
}

/* Undocumented function
* Parses the property visibility rules inside a given visibility rule.
*
* @param {object} rule - the XML rule to be parsed
* @param {object} holder - the visibility rule object that will hold
* the rule
* @param {String} mode - the rule's mode, i.e. whether the rule will
* replace, alter or delete its previous instance if that instance exists
*/
function _parseVisibilityInProperties(rule, holder, mode) {
	for (let iChild = 0; iChild < rule.childNodes.length; iChild++) {
		let child = rule.childNodes[iChild];
		if (child.nodeType !== child.ELEMENT_NODE)
			continue;

		let childMode = this._parseMode(child.getAttribute('mode'));
		this._debugData.kRule++;

		//add the visibility rule to the ruleStack
		let stackedRule = {
			rule: child,
			kind: child.tagName,
			id: null,
			mode: childMode,
			kRule: this._debugData.kRule,
		};
		this._ruleStack.push(stackedRule);

		if (child.tagName === 'property') {
			let parsedProp = {
				id: null,
				classes: new Set(),
				mode: mode,
			};
			for (let iAttr = 0; iAttr < child.attributes.length; iAttr++) {
				let attr = child.attributes[iAttr];
				switch (attr.name) {
					case 'id':
						parsedProp.id = attr.textContent;
						break;
					case 'class':
						parsedProp.classes =
							this._parseClasses(attr.textContent);
						break;
					case 'mode':
						parsedProp.mode =
							this._parseMode(attr.textContent);
						break;
					case 'vis':
						parsedProp.vis =
							this._parseBoolean(attr.textContent);
						break;
					case 'refresh':
						parsedProp.refresh =
							this._parseBoolean(attr.textContent);
						break;
					default:
						this._throwParserError(
							+ "Invalid attribute name for property "
							+ "visibility rule: " + attr.name + ". "
							+ "Please provide a valid attribute name "
							+ "as described in the manual."
						);
				}
			}
			if (!parsedProp.classes)
				parsedProp.classes = new Set();
			if (!parsedProp.id)
				parsedProp.id = null;

			holder.push(parsedProp);
		} else {
			this._throwParserError(
				'Invalid tag name for child of visibility tag: '
				+ "expected '<property>', got '<" + child.tagName
				+ ">'"
			);
		}
	}
}

/* Undocumented function
* Parses an encounter visibility rule.
* 
* @param {object} rule - the XML rule to be parsed
* @param {object} holder - the visibility rule object that will hold the
* rule
* @param {String} mode - the rule's mode, i.e. whether the rule will
* replace, alter or delete its previous instance if that instance exists
* @param {Boolean} isTopLevel - whether the parsed rule is a top-level
* rule, located in the <visibility> element that sits directly inside
* the <ruleset> element.
*/
function _parseVisibilityEncounter(rule, holder, mode, isTopLevel) {
	let parsedRule = {};

	for (let iAttr = 0; iAttr < rule.attributes.length; iAttr++) {
		let attr = rule.attributes[iAttr];
		switch (attr.name) {
			case 'id':
				parsedRule.id = attr.textContent;
				break;
			case 'class':
				parsedRule.classes = this._parseClasses(attr.textContent);
				break;
			case 'mode':
				mode = this._parseMode(attr.textContent);
				break;
			case 'properties':
				parsedRule.properties =
					this._parseBoolean(attr.textContent)
				break;
			case 'propertiesRefresh':
				parsedRule.propertiesRefresh = 
					this._parseBoolean(attr.textContent)
				break;
			case 'traits':
				parsedRule.traits = 
					this._parseBoolean(attr.textContent)
				break;
			case 'traitsRefresh':
				parsedRule.traitsRefresh = 
					this._parseBoolean(attr.textContent)
				break;
			case 'secrets':
				parsedRule.secrets = 
					this._parseBoolean(attr.textContent)
				break;
			case 'secretsRefresh':
				parsedRule.secretsRefresh = 
					this._parseBoolean(attr.textContent)
				break;
			default:
				this._throwParserError(
					+ "Invalid attribute name for encounter visibility "
					+ "rule: " + attr.name + ". Please provide a valid "
					+ "attribute name as described in the manual."
				);
		}
	}

	//process the parsed rule
	_processParsedRule.bind(this)
		(parsedRule, 'encounter', rule, holder, mode, isTopLevel);
}


//[TODO] Do not parse properties for action rules!



// The visibility objects, placed here for convenience
// These contain the visibility settings for various game entities

// action-kind-specific visibility rules
const _visSpecificAction = {
	action: null,
	actionToMySide: null,
	actionBuildup: null,
	actionBuildupRefresh: null,
};

/// argument-kind-specific visibility rules
const _visSpecificArgument = {
	propList: [],
	properties: null,
	propertiesRefresh: null,
	traits: null,
	traitsRefresh: null,
	kind: null,
	kindRefresh: null,
}

// booster-kind-specific visibility rules
const _visSpecificBooster = {
	propList: [],
	properties: null,
	propertiesRefresh: null,
	kind: null,
	kindRefresh: null,
}

// character-kind-specific visibility rules
const _visSpecificCharacter = {
	action: null,
	actionToMySide: null,
	actionBuildup: null,
	actionBuildupRefresh: null,
	propList: [],
	properties: null,
	propertiesRefresh: null,
	identity: null,
	identityRefresh: null,
	kind: null,
	kindRefresh: null,
	traits: null,
	traitsRefresh: null,
	secrets: null,
	secretsRefresh: null,
}

// encounter-kind-specific visibility rules
const _visSpecificEncounter = {
	propList: [],
	properties: null,
	propertiesRefresh: null,
	traits: null,
	traitsRefresh: null,
	secrets: null,
	secretsRefresh: null,
}

//trait-kind-specific visibility rules
const _visSpecificTrait = {
	trait: null,
	traitRefresh: null,
}

// kind-specific visibility rules
const _visSpecific = {
	action: _visSpecificAction,
	argument: _visSpecificArgument,
	booster: _visSpecificBooster,
	encounter: _visSpecificEncounter,
	trait: _visSpecificTrait,
}

// using classes for top-level default visibility rules because we can't
// just use JSON.parse(JSON.stringify())) to create copies of these rules
// due to the fact that 'classes' is a Set(), which gets converted to a
// base Object when stringifying and parsing.

//Top-level default visibility rules for arguments
class _VisTopLevelArgument {
	constructor() {
		this.id = null;
		this.classes = new Set();
		this.propList = [];
		this.properties = false;
		this.propertiesRefresh = false;
		this.traits = false;
		this.traitsRefresh = false;
		this.kind = true;
		this.kindRefresh = false;
	}
};

//Top-level default visibility rules for boosters
class _VisTopLevelBooster {
	constructor() {
		this.id = null;
		this.classes = new Set();
		this.propList = [];
		this.properties = false;
		this.propertiesRefresh = false;
		this.kind = false;
		this.kindRefresh = false;
	}
};

//Top-level default visibility rules for characters
class _VisTopLevelCharacter {
	constructor() {
		this.id = null;
		this.classes = new Set();
		this.action = true;
		this.actionToMySide = true;
		this.actionBuildup = false;
		this.actionBuildupRefresh = true;
		this.propList = [];
		this.properties = false;
		this.propertiesRefresh = false;
		this.identity = true;
		this.identityRefresh = false;
		this.kind = true;
		this.kindRefresh = false;
		this.traits = false;
		this.traitsRefresh = false;
		this.secrets = false;
		this.secretsRefresh = false;
	}
};

//Top-level default visibility rules for encounters
class _VisTopLevelEncounter {
	constructor() {
		this.id = null;
		this.classes = new Set();
		this.propList = [];
		this.properties = false;
		this.propertiesRefresh = false;
		this.traits = true;
		this.traitsRefresh = false;
		this.secrets = false;
		this.secretsRefresh = false;
	}
};

//Top-level default visibility rules for traits
class _VisTopLevelTrait {
	constructor() {
		this.id = null;
		this.classes = new Set();
		this.trait = false;
		this.traitRefresh = false;
	}
};

// Utility object that allows creating a certain type of default
// top-level visibility rule by, for instance,
// _visTopLevelCreator['trait']()
const _visTopLevelCreator = {
	argument: function() { return new _VisTopLevelArgument() },
	booster: function() { return new _VisTopLevelBooster() },
	character: function() { return new _VisTopLevelCharacter() },
	encounter: function() { return new _VisTopLevelEncounter() },
	trait: function() { return new _VisTopLevelTrait() },
}

//Top-level default visibility rules
class _VisTopLevel {
	constructor() {
		this.argument = [new _VisTopLevelArgument()];
		this.booster = [new _VisTopLevelBooster()];
		this.character = [new _VisTopLevelCharacter()];
		this.encounter = [new _VisTopLevelEncounter()];
		this.trait = [new _VisTopLevelTrait()];
		this.prop = [];
	}
};

export { _parseVisibility, _VisTopLevel }
