/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import Action from './action.js';
import Argument from './argument.js';
import Booster from './booster.js';
import Character from './character.js';
import Effect from './effect.js';
import Trait from './trait.js';

import List from './list.js';

//[TODO] Use Object.assign(dest, src) to copy entity types into their
// respective entities

/**
* A ruleset, parsed from one or more xml files, containing all the rules
* for social encounters.
*
* Xml files containing rules must specify the different types of actions,
* arguments, boosters, characters, character traits, encounter traits etc.
* (i.e. all the different game entities). They do not need to contain rules
* for the 'create-argument', 'create-booster' and 'retarget' actions, but
* may overwrite the rules for these.
* 
* To see the structure of the xml element corresponding to a given game
* entity, check the entity's class in the docs (e.g.
* Faith.Encounter.Argument or Faith.Encounter.Action).
* 
* When a rules xml file is parsed, if a rule previously existed for a game
* entity with the same ID, the rule is partially overwritten so that the
* new rule's contents replace those of the old. This allows, for instance,
* a mod to replace the cost of an action while leaving the rest of the
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
	constructor(...args) {
		/**
		* The list of all entities in the ruleset.
		* @type {Faith.Encounter.List<*>}
		*/
		this.all = new List();

		/**
		* The list of action types in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Action>}
		*/
		this.actions = new List();	

		/**
		* The list of argument types in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Argument>}
		*/
		this.args = new list();

		/**
		* The list of argument trait types in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Trait>}
		*/
		this.argTraits = new List();

		/**
		* The list of booster types in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Booster>}
		*/
		this.boosters = new List();

		/**
		* The list of character types in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Character>}
		*/
		this.chars = new List();

		/**
		* The list of character trait types in the ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Trait>}
		*/
		this.charTraits = new List();

		/**
		* The list of effect types in this ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Effect>}
		*/
		this.effects = new List();

		/**
		* The list of encounter trait types in this ruleset.
		* @type {Faith.Encounter.List<Faith.Encounter.Trait>}
		*/
		this.encounterTraits = new List();

		/**
		* The list of researchable entities in the game.
		* Access the nth tier, which is a Faith.Encounter.List,
		* using research.tier[n-1]
		*
		* @type <object>
		*/
		this.research = {tier: [], untiered: new List()}

		for	(let arg of args) {
			this.addXml(arg);
		}
	}	

	/**
	* Adds the specified entity or entities to the ruleset.
	* @example
	* ruleset.add(entity1, entity2, entity3);
	* @param {...Faith.Encounter.Action|Faith.Encounter.Argument
	*	|Faith.Encounter.Booster|Faith.Encounter.Effect
	*	|Faith.Encounter.Trait} entity - the entities to be added
	*/
	add(...entities) {
		for (let entity of entities) {
			if (entity instanceof Action) {
				this.actions.add(entity);
			} else if (entity instanceof Argument) {
				this.args.add(entity);
			} else if (entity instanceof Booster) {
				this.boosters.add(entity);
			} else if (entity instanceof Character) {
				this.chars.add(entity);
			} else if (entity instanceof Effect) {
				this.effects.add(entity);
			} else if (entity instanceof Trait) {
				//[TODO]
			} else {
				throw 'Invalid entity type to be added: must be an Action,
					+ 'Argument, Booster, Character, Effect or Trait.';
			}

			this.all.add(entity);
		}
	}

	/**
	* Removes the specified entity or entities from the ruleset.
	* @example
	* ruleset.remove(entity1, entity2, entity3);
	* @param {...Faith.Encounter.Action|Faith.Encounter.Argument
	*	|Faith.Encounter.Booster|Faith.Encounter.Effect
	*	|Faith.Encounter.Trait} entity - the entities to be removed
	*/
	remove(...entities) {
		for (let entity of entities) {
			if (entity instanceof Action) {
				if (this.actions.indexOf(entity) === -1)
					continue;
				this.actions.splice(this.actions.indexOf(entity), 1);

			} else if (entity instanceof Argument) {
				if (this.args.indexOf(entity) === -1)
					continue;
				this.args.splice(this.args.indexOf(entity), 1);

			} else if (entity instanceof Booster) {
				if (this.boosters.indexOf(entity) === -1)
					continue;
				this.boosters.splice(this.boosters.indexOf(entity), 1);

			} else if (entity instanceof Character) {
				if (this.chars.indexOf(entity) === -1)
					continue;

				this.chars.splice(this.chars.indexOf(entity), 1);
			} else if (entity instanceof Effect) {
				if (this.effects.indexOf(entity) === -1)
					continue;

				this.effects.splice(this.effects.indexOf(entity), 1);
			} else if (entity instanceof Trait) {
				//[TODO] account for different trait Lists; also ensure
				// that the loops skips over this entity if it is not found
			} else {
				throw 'Invalid entity type to be added: must be an Action,
					+ 'Argument, Booster, Character, Effect or Trait.';
			}
			this.all.splice(this.all.indexOf(entity), 1);
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
			xml = parser.parseFromString(source);
		} else if (source instanceof XMLDocument) {
			xml = source;
		} else {
			throw 'invalid XML rule source, cannot add to ruleset';
		}


		return this;
	}

	/**
	* Parse an action from its XML DOM element.
	*
	* @private
	*/
	_parseAction(elem) {
		
	}

	validate() {
		let entity;
		//validate all game entities' individual traits
		for (entity of this.all) {
			entity.validate();
		}

		// check that all entities have ids and that no two game
		// entities have the same id
		for (let i = 0; i < this.all.list.length; i++) {
			entity = this.all.list[i];
			for (let j = i + 1; j < this.all.list.length; j++) {
				if (this.all.list[j].id === entity.id) {
					throw 'Game entity number ' + i + ' and game entity '
						+ 'number ' + j + ' in the ruleset have the same '
						+ 'id, ' + entity.id + ' . Please give '
						+ 'each type of argument, booster etc. a unique '
						+ 'id that is unique among all game entities ('
						+ 'an argument and a booster cannot share the '
						+ 'same id. Separate the words in the id with '
						+ 'hyphens (-).';
				}
			}
		}
	}
}
export default Ruleset;
