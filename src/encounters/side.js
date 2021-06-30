/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/** 
* The data about a given side, stored in the EncounterManager.
* @type {Faith.Encounter.EncounterSide}
*/
class Side {
	/**
	* creates a new side.
	*
	* @constructor Faith.Encounter.Side
	* @param {boolean} isNeutral - whether this side is neutral
	*/
	constructor(isNeutral = false) {
		/**
		* Whether this side is neutral.
		*
		* @type {boolean}
		* @default false
		*/
		this.isNeutral = isNeutral;

		/**
		* The list of arguments that this side owns.
		* 
		* @type {Array.<Faith.Encounter.Argument>}
		* @default {[]}
		*/
		this.args = [];

		/**
		* The list of Characters on this side.
		*
		* @type {Array.<Faith.Encounter.Character>}
		* @default []
		*/
		this.chars = [];

		/**
		* The list of global boosters on this side.
		*
		* @type {Array.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.gboosters = [];

		/**
		* The research points held by this side.
		*
		* @type {number}
		* @default 0
		*/
		this.researchPoints = 0;

		/**
		* The actions researched by this side.
		*
		* @type {Array.<Faith.Encounter.Action>}
		* @default []
		*/
		this.researchedActions = [];

		/**
		* The arguments researched by this side. 
		*
		* @type {Array.<Faith.Encounter.Argument>}
		* @default []
		*/
		this.researchedArguments = [];

		/**
		* The bonuses researched by this side.
		*
		* @type {Array.<Faith.Encounter.Effect>}
		* @default []
		*/
		this.researchedBoosters = [];

		/**
		* The boosters researched by this side.
		*
		* @type {Array.<Faith.Encounter.Booster>}
		* @default []
		*/
		this.researchedBoosters = [];

		/**
		* The argument traits researched by this side.
		*
		* @type {Array.<Faith.Encounter.Trait>}
		* @default []
		*/
		this.researchedTraits = [];

		/**
		* The secrets found by this side.
		*
		* @type {Array.<Faith.Encounter.Secret>}
		* @default []
		*/
		this.secretsFound = [];
	}
}

export default Side;
