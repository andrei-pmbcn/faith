/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { ActionKind } from './action.js';
import { ArgumentKind } from './argument.js';
import { BoosterKind } from './booster.js';
import { CharacterKind } from './character.js';
import { EncounterKind, _parseEncounterKind } from './encounter.js';
import { EffectKind } from './effect.js';
import { TraitKind } from './trait.js';

import { parserMixin } from './parser.js';
import { _parseVisibility, _VisTopLevel } from './ruleset2.js';
import { Map } from './list.js';

import xmldom from 'xmldom';
const Parser = xmldom.DOMParser;

/**
* The configuration object used when creating the ruleset.
* @typedef {Object} Faith.Encounter.rulesetConfig
* 
* @property {Boolean} [displayDomOnErrors=false] - Whether to display the
* XML DOM element that features the error when throwing errors and
* warnings.
*
* @property {Boolean} [displayContextOnErrors=true] - 
* Whether the ruleset displays the context of an xml error
* (or warning). The context will show the xml element that has
* the problem as well as some of the text before and after the
* xml element in the xml file, for ease of searching.
*
* @property {Boolean} [displayContextPadded=true] - 
* Whether, when an error or warning occurs, to display the padded
* context, which includes parts of the previous and next XML
* elements, as part of displaying the context of the error,
* which will always include the XML element affected by the error.
*
* @property {Boolean} [displayWarnings=true] - 
* Whether to display warnings when they occur.
*
* @property {Boolean} [raiseAlertOnErrors=false] - 
* Whether the ruleset raises an alert on errors.
* 
* @property {Boolean} [raiseAlertOnWarnings=false] - 
* Whether the ruleset raises an alert on warnings.
*/
const rulesetConfig = {
	displayDomOnErrors: false,
	displayContextOnErrors: true,
	displayContextPadded: true,
	displayWarnings: true,
	raiseAlertOnErrors: false,
	raiseAlertOnWarnings: false,
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
		if (!config)
			config = {};

		/**
		* Whether the ruleset displays the XML DOM element that features
		* the error when throwing parser errors and warnings.
		*
		* @private
		* @type {Boolean}
		* @default false
		*/
		this._displayDomOnErrors = config.displayDomOnErrors ?? false;

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
		* @default false
		*/
		this._raiseAlertOnErrors = config.raiseAlertOnErrors ?? false;

		/**
		* Whether the ruleset raises an alert on warnings.
		*
		* @private
		* @type {Boolean}
		* @default false
		*/
		this._raiseAlertOnWarnings = config.raiseAlertOnWarnings ?? false;

		/**
		* The list of all entity kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.EntityKind>}
		*/
		this.all = new Map();

		/**
		* The list of action kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.ActionKind>}
		*/
		this.actions = new Map();	

		/**
		* The list of argument kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.ArgumentKind>}
		*/
		this.args = new Map();

		/**
		* The list of argument trait kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.TraitKind>}
		*/
		this.argTraits = new Map();

		/**
		* The list of booster kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.BoosterKind>}
		*/
		this.boosters = new Map();

		/**
		* The list of character kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.CharacterKind>}
		*/
		this.chars = new Map();

		/**
		* The list of character trait kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.TraitKind>}
		*/
		this.charTraits = new Map();

		/**
		* The list of cost templates, storing all the costs with a
		* non-numerical id that are part of this ruleset. Used in
		* creating child costs via <copyById></copyById>, which copies
		* the data from a template with a given id to the game entity
		* encapsulating the <copyById> tag.
		* 
		* @type {Faith.Encounter.List<Faith.Encounter.Cost>}
		*/
		this.costTemplates = new Map();

		//[TODO] Copy multiple templates by id into the same game entity

		/**
		* The list of condition templates, storing all the conditions
		* with a non-numerical id that are part of this ruleset. Used in
		* creating child conditions as with the costTemplates member.
		*
		* @type {Faith.Encounter.List<Faith.Encounter.Condition>}
		*/
		this.condTemplates = new Map();
		//[TODO] change Faith.Encounter.Condition if appropriate

		/**
		* The list of effect kinds in this ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.EffectKind>}
		*/
		this.effects = new Map();

		/**
		* The list of encounter kinds in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.EncounterKind>}
		*/
		this.encounters = new Map();

		/**
		* The list of encounter trait kinds in this ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.TraitKind>}
		*/
		this.encounterTraits = new Map();

		/**
		* The list of researchable entities in the game.
		* Access the nth tier, which is a Faith.Encounter.List,
		* using research.tier[n-1] .
		* Access the untiered researchables using research.untiered .
		*
		* @type Object
		*/
		this.research = {tier: [], untiered: new Map()}

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
	vis = new _VisTopLevel();
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
	* @param {String} fileName - an optional file name, shown in errors.
	* @return {Faith.Encounter.Ruleset} the ruleset itself.
	*/
	parse(source, fileName = null) {
		let xml;
		
		let errMsg = 'Invalid XML rule source, cannot add '
			+ 'to ruleset. please ensure that the rule source is a '
			+ 'valid XML String or an XMLDocument.'
		if (typeof source === 'string') {
			let parser = new Parser();
			xml = parser.parseFromString(source, 'text/xml');
			if (typeof xml === 'undefined') {
				this._throwParserError(errMsg);
			}
		} else if ((typeof XMLDocument !== 'undefined'
				&& source instanceof XMLDocument)
				|| source instanceof Object) {
			xml = source;
		} else {
			this._throwParserError(errMsg);
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
				+ 'any rulesets.', true);
		}

		for (let kRuleset = 0; kRuleset < rulesets.length; kRuleset++) {
			this._ruleStack = [];
			let ruleset = rulesets[kRuleset];

			this._debugData = {
				sourceText: typeof source === 'string' ? source : null,
				xml: xml,
				kRuleset: kRuleset,
				kRule: 0,
				ruleset: ruleset,
				fileName: fileName,
			};

			let isWipe = ruleset.getAttribute('wipe') === 'all'
				? true : false;
			let rules = ruleset.childNodes;

			if (isWipe) {
				//wipe the ruleset
				this.wipe();
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

			let noRulesFound = true;
			for (let iRule = 0; iRule < rules.length; iRule++) {
				if (rules[iRule].nodeType !== rules[iRule].ELEMENT_NODE)
					continue;

				noRulesFound = false;
				let rule = rules[iRule];
				let kind = rule.tagName;

				// [WARNING] do not replace this with this._parseId()!
				// All top-level rules must have an id; entities must have
				// an id by default, and top-level costs, effects and
				// conditions must have ids in order to be referenced by
				// entities that copy from them, as they are
				// templates.
				if (!rule.id && !(kind === 'visibility')) {
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
						break;
					default:
						this._throwParserError(
							'Invalid rule tag. Expected tag name '
							+ ' to be \'action\', \'booster\' etc. '
							+ '(without quotes), got ' + kind
							+ ' instead.');
				}
			
				this._ruleStack.pop();
			}
			if (noRulesFound) {
				this._throwParserError('Xml ruleset does not contain any '
					+ 'rules.', true);
			}
		}

		this._loadTemplates()
		return this;
	}

	validate() {
		//[TODO]
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
						+ 'id, ' + entityKind.id + ' . Please give '
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
	* Resets the ruleset, wiping all entity data and setting the rules
	* to the defaults
	*/
	wipe() {
		// wipe the ruleset's data
		this.all = new Map();
		this.args = new Map();
		this.actions = new Map();
		this.argTraits = new Map();
		this.boosters = new Map();
		this.chars = new Map();
		this.charTraits = new Map();
		this.costTemplates = new Map();
		this.condTemplates = new Map();
		this.effects = new Map();
		this.encounters = new Map();
		this.encounterTraits = new Map();
		this.research = {tier: [], untiered: new Map()};

		// reset the basic rules to the defaults
		this.allVisible = false;
		this.overrideDefaultProbing = false;
		this.overrideDefaultResearch = false; //[TODO]
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

	/**
	* An array holding the rules currently being parsed, starting from the
	* outermost rule (e.g. <encounter></encounter>) and ending with the
	* innermost rule (e.g. <cost></cost>).
	* 
	* @private
	* @property {Object} xml - the XML node of the given rule
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

	/**
	* Data stored internally to provide accurate error messages
	*
	* @private
	* @type {Object}
	* @property {String|null} sourceText - the source text string of the XML
	* document parenting the XML rulesets to be parsed
	* @property {XMLDocument|null} xml - the XML document parenting the XML
	* rulesets to be parsed
	* @property {number|null} kRuleset - the number of <ruleset> tags
	* encountered up to the current <ruleset> tag in the source string
	* @property {Object} ruleset - the XML ruleset
	* @property {number} kRule - the number of entity tags encountered
	* up to the current entity tag in the source string
	*/
	_debugData = {sourceText: null, xml: null, kRuleset: null,
		ruleset: null, kRule: 0, fileName: null };

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
	* @param {Set} classes1 - the first list of class names
	* @param {Set} classes2 - the second list of class names
	* @return {Boolean} the result of the check
	*/
	_checkClassesSame(classes1, classes2) {
		if (classes1.size !== classes2.size)
			return false;

		for (let cls1 of classes1) {
			let found = false;
			for (let cls2 of classes2) {
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
	* Loads all defaults and other templates into their dependents
	*/
	_loadTemplates() {
		//[TODO]
	}

	/**
	* Parses an action from its XML DOM element.
	*
	* @private
	* @param {Object} rule - the XML-based action rule to be parsed
	*/
	_parseAction(rule) {
		
	}

	/**
	* Parse a visibility rule from its XML DOM element
	* 
	* @private
	* @method
	* @param {Object} rule - the XML-based visibility rule to be parsed
	*/
	_parseVisibility = _parseVisibility;

}

Object.assign(Ruleset.prototype, parserMixin);

export { rulesetConfig, Ruleset };

