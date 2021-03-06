/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { List, Map } from './list.js'

/**
* The data about a given side, stored in the EncounterManager.
*
* @memberof Faith.Encounter
*/
class Side {
	/**
	* @param {Number} side - the index of this side, which is 0 for the
	* neutral side, 1 for side 1 and 2 for side 2.
	*/
	constructor(side) {
		/**
		* The index of this side, which is 0 for the neutral side,
		* 1 for side 1 and 2 for side 2.
		*
		* @type {number}
		*/
		this.side = side;

		/**
		* The list of (unfinished) actions that this side owns.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Action>}
		*/
		this.actions = new List();

		/**
		* The list of arguments that this side owns.
		* 
		* @type {Faith.Encounter.List.<Faith.Encounter.Argument>}
		* @default []
		*/
		this.args = new List();

		/**
		* The list of Characters on this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Character>}
		* @default new List()
		*/
		this.chars = new List();

		/**
		* The list of all boosters on this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.boosters = new List();

		/**
		* The list of global boosters on this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.gBoosters = new List();

		/**
		* The list of argument boosters on this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.argBoosters = new List();

		/**
		* The list of friendly boosters on this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.friendlyBoosters = new List();

		/**
		* The list of adverse boosters on this side (i.e. affecting
		* arguments on the opposing side)
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.adverseBoosters = new List();

		/**
		* The list of effects this side has.
		*
		* @type {Faith.Encounter.List<Faith.Encounter.Effect>}
		* @default []
		*/
		this.effects = new List();

		/**
		* The list of items this side has.
		*
		* @type {Faith.Encounter.List<Faith.Encounter.Item>}
		* @default []
		*/
		this.items = new List();

		/**
		* The list of items currently being equipped by characters that this
		* side has.
		*
		* @type {Faith.Encounter.List<Faith.Encounter.Item>}
		* @default []
		*/
		this.equippedItems = new List();

		/**
		* The list of items on this side that currently have no owner.
		* If the ruleset states that unowned items may not exist, this list
		* will always be empty.
		*
		* @type {Faith.Encounter.List<Faith.Encounter.Item>}
		* @default []
		*/
		this.unownedItems = new List();

		/**
		* The properties attached to this side. Access them using
		* props.<property> .
		*
		* @type {Faith.Encounter.Map.<Faith.Encounter.Property>}
		* @default {}
		*/
		this.props = new Map();

		/**
		* The entities researched by this side.
		*
		* @type {Faith.Encounter.List}
		* @default []
		*/
		this.researched = new List();

		/**
		* The actions researched by this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Action>}
		* @default []
		*/
		this.researchedActions = new List();

		/**
		* The arguments researched by this side. 
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Argument>}
		* @default []
		*/
		this.researchedArguments = new List();

		/**
		* The boosters researched by this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.researchedBoosters = new List();

		/**
		* The effects researched by this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Effect>}
		* @default []
		*/
		this.researchedEffects = new List();

		/**
		* The argument traits researched by this side.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Trait>}
		* @default []
		*/
		this.researchedTraits = new List();

		/**
		* The secrets found by this side.
		*
		* @type {Faith.Encounter.List}
		* @default []
		*/
		this.secretsFound = new List();

		//[TODO] individual lists of types of secrets found
	}
}

export { Side };
