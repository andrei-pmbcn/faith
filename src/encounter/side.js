/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/**
* The data about a given side, stored in the EncounterManager.
*
* @memberof Faith.Encounter
*/
class Side {
	/**
	* @param {boolean} isNeutral - whether this side is neutral
	*/
	constructor(index) {
		/**
		* The index of this side, which is 0 for the neutral side,
		* 1 for side 1 and 2 for side 2.
		*
		* @type {number}
		*/
		this.index = index;

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
		* The list of properties owned by this side.
		*
		* @type {object.<Faith.Encounter.Property>}
		* @default {}
		*/
		this.props = {};

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
		this.researchedBonuses = [];

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

export Side;
