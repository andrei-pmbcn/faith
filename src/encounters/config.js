/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/**
 * @typedef EncounterConfig
 * @type {Object}
 */
export default {
	/*
	* The list of characters on side 1; there must be characters on side
	* 1 for the encounter to take place
	*
	* @name charsSide1
	* @type {Array.Character}
	* @default []
	*/
	charsSide1: [],

	/*
	* The list of characters on side 2; there must be characters on side
	* 2 for the encounter to take place
	*
	* @name charsSide2
	* @type {Array.Character}
	* @default []
	*/
	charsSide2: [],

	/*
	* The list of neutral characters
	*
	* @name charsNeutral
	* @type {Array.Character}
	* @default []
	*/
	charsNeutral: [],

	/*
	* The list of arguments that side 1 starts the encounter with
	*
	* @name argsSide1
	* @type {Array.Argument}
	* @default []
	*/
	argsSide1: [],

	/*
	* The list of arguments that side 2 starts the encounter with
	*
	* @name argsSide2
	* @type {Array.Argument}
	* @default []
	*/
	argsSide2: [],

	/*
	* The list of global boosters that side 1 starts the encounter with
	*
	* @name gboostersSide1
	* @type {Array.Booster}
	* @default []
	*/
	gboostersSide1: [],

	/*
	* The list of global boosters that side 2 starts the encounter with
	*
	* @name gboostersSide2
	* @type {Array.Booster}
	* @default []
	*/
	gboostersSide2: [],

	/*
	* The number of research points that side 1 starts the encounter with
	*
	* @name researchPointsSide1
	* @type {number}
	* @default 0
	*/
	researchPointsSide1: 0,

	/*
	* The number of research points that side 2 starts the encounter with
	*
	* @name researchPointsSide2
	* @type {number}
	* @default 0
	*/
	researchPointsSide2: 0,

	/*
	* The list of arguments, boosters and actions that side 1 has
	* researched
	*
	* @name researchedSide1
	* @type {Array.{Action|Argument|Booster}}
	* @default []
	*/
	researchedSide1: [],

	/*
	* The list of arguments, boosters and actions that side 2 has
	* researched
	*
	* @name researchedSide2
	* @type {Array.{Action|Argument|Booster}}
	* @default []
	*/
	researchedSide2: [],

	/*
	* The number of probing points that side 1 starts the encounter with
	*
	* @name probingPointsSide1
	* @type {number}
	* @default 0
	*/
	probingPointsSide1: 0,

	/*
	* The number of probing points that side 2 starts the encounter with
	*
	* @name probingPointsSide2
	* @type {number}
	* @default 0
	*/
	probingPointsSide2: 0,

	/*
	* The list of Secrets that side 1 is hiding
	*
	* @name secretsSide1
	* @type {Array.{Action|Argument|Booster}}
	* @default []
	*/
	secretsSide1: [],

	/*
	* The list of Secrets that side 2 is hiding
	*
	* @name secretsSide2
	* @type {Array.{Action|Argument|Booster}}
	* @default []
	*/
	secretsSide2: [],


	/*
	* The list of Secrets that the neutral side is hiding
	*
	* @name secretsNeutral
	* @type {Array.{Action|Argument|Booster}}
	* @default []
	*/
	secretsNeutral: [],

	/*
	* A list of extra numerical properties to be added to the social
	* encounter
	*
	* @name props
	* @type {Array.string}
	* @default []
	*/
	props: [],

	/*
	* Whether alerts (modals) should be created when encountering an error
	*
	* @name
	* @type {boolean}
	* @default true
	*/
	raiseAltertOnBugs: true,
}
