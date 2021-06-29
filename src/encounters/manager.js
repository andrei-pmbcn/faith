/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import encounterConfig from './config.js';

/**
* The EncounterManager singleton class handles the logic of the entire
* encounter, applying effects to the various entities in the game
* (characters, boosters, arguments and traits), processing research and
* probing 
*/
class EncounterManager {
	/**
	* The config object is the only parameter needed, but must include
	* the charSide1 and charSide2 parameters if these are not specified
	* in the config object
	*
	* @constuctor
	* @param {EncounterConfig} config - a config object specifying all the
	* parameters for creating the encounter; can be set to `{}` if the
	* characters are specified in the following two arguments to the
	* constructor 
	* @param {Array.Character} charsSide1 - the characters on side 1
	* @param {Array.Character} charsSide2 - the characters on side 2
	*/
	constructor(config,
		charsSide1,
		charsSide2,
	) {

		if (!config) {
			config = encounterConfig;
		}

	 	this.raiseAlertOnBugs = config.raiseAlertOnBugs ?? true;

		if (config.charsSide1) {
			this.chars.side1 = config.charsSide1;
		} else if (charsSide1) {
			this.chars.side1 = charsSide1;
		} else {
			this.chars.side1 = [];
		}
		if (this.chars.side1 === []) {
			this._throw('no characters specified for side 1; please '
				+ 'include a non-empty <config>.charsSide1 array, where '
				+ '<config> is your encounter configuration object, or '
				+ 'specify a charsSide1 argument in your encounter\'s '
				+ 'constructor.');
		}

		if (config.charsSide2) {
			this.chars.side2 = config.charsSide2;
		} else if (charsSide2) {
			this.chars.side2 = charsSide2;
		} else {
			this.chars.side2 = [];
		}
		if (this.chars.side2 === []) {
			this._throw('no characters specified for side 2; please '
				+ 'include a non-empty <config>.charsSide2 array, where '
				+ '<config> is your encounter configuration object, or '
				+ 'specify a charsSide2 argument in your encounter\'s '
				+ 'constructor.');
		}
		
	/**
	* The list of `Arguments` (game arguments, not code arguments) in the
	* encounter, divided into a `side1` array and a `side2` array.
	* [Argument]{@link Argument}
	* Get the `Arguments` with e.g. args.side1[5] or args.side2[3]
	*
	* @type {Object.Array.Argument}
	* @default {side1: [], side2: []}
	*/
	this.args = {side1: [], side2: []};

		this.args.side1 = config.argsSide1 ?? [];

		this.args.side2 = config.argsSide2 ?? [];
		this.gboosters.side1 = gboostersSide1 ?? [];
		this.gboosters.side2 = gboostersSide2 ?? [];

		


	}

	/**
	* The list of characters in the encounter, divided into a `side1`
	* array and a `side2` array.
	*
	* Get characters with e.g. chars.side1[5] or chars.side2[3]
	*
	* @type {Object}
	* @default {side1: [], side2: []}
	*/
	chars = {side1: [], side2: []};

	/**
	* The index of the current turn, e.g. turn 1, turn 2 etc.
	*
	* @type {number}
	* @default 1
	*/
	currentTurn = 1;

	/**
	* The list of global boosters in the encounter, divided into a `side1`
	* array and a `side2` array.
	*
	* Get boosters with e.g. gboosters.side1[5] or gboosters.side2[3]
	*
	* @type {Object}
	* @default {side1: [], side2: []}
	*/
	gboosters = {side1: [], side2: []};

	/**
	* The encounter's game-related properties, such as the number of
	* research points a given side has. Custom properties may be added
	* to this.
	* 
	* @type {Array}
	* @default {research1: 0, research2: 0, probing1: 0, probing2: 0}
	*/
	props = [];


	//[TODO] implement and test
	/**
	* Gets a given argument by their id number
	* 
	* @param {number} id - the id to be searched
	* @return {Argument} the argument returned
	*/
	getArgumentById(id) {

	}

	//[TODO] implement and test
	/**
	* Gets a given argument by their name; it is completely optional
	* for arguments to have names. If more than one name is found,
	* return an array of arguments.
	* 
	* @param {string} name - the name to be searched
	* @return {Argument|Array.Argument} the argument or arguments
	* returned
	*/
	getArgumentByName(name) {

	}

	//[TODO] implement and test
	/**
	* Gets a given character by their id number
	* 
	* @param {number} id - the id to be searched
	* @return {Character} the character returned
	*/
	getCharacterById(id) {

	}

	//[TODO] implement and test
	/**
	* Gets a given character by their name
	* 
	* @param {string} name - the name to be searched
	* @return {Character|Array.Character} the character returned
	*/
	getCharacterByName(name) {

	}

	//[TODO] implement and test
	/**
	* issues an order for a character to perform a given action.
	*
	* @param {Character} character - the character ordered to perform the
	* action
	* @param {Action} action - the action to be performed
	*/
	order(character, action) {


	}

	//[TODO] implement and test
	/**
	* processes a single turn.
	*/
	runTurn() {

	}

	/**
	* Throws an error and, if this.raiseAlertOnBugs is true, an alert 
	*
	* @access private
	*
	* @param {string} err - the error message
	*/
	_throw(err) {
		if (this.raiseAlertOnBugs == true) {
			alert('Error in social encounter manager: ' + err);
		}
		throw err;
	}
}

export default EncounterManager;
