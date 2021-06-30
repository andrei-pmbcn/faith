/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import encounterConfig from './config.js';
import Side from './side.js';

/**
* @namespace Faith.Encounter
*/

/**
* The EncounterManager singleton class handles the logic of the entire
* encounter, applying effects to the various entities in the game
* (characters, boosters, arguments and traits), processing research and
* probing and carrying out commands.
*/
class EncounterManager {
	/**
	* Creates the EncounterManager.
	* 
	* @constuctor Faith.Encounter.EncounterManager
	* @param {EncounterConfig} config - a config object specifying all the
	* parameters for creating the encounter; its charsSide1 and charsSide2
	* array members must each contain at least one Character.
	*/
	constructor(config) {
		if (!config) {
			this.raiseAlertOnErrors = true;
			this._throw('missing config object for the '
				+ 'EncounterManager\'s constructor');
			return;
		}

	 	this.raiseAlertOnErrors = config.raiseAlertOnErrors ?? true;
		this.eventPrefix = config.eventPrefix ?? 'Encounter-';

		/**
		* Side 1 for the encounter
		* 
		* @type {Faith.Encounter.Side}
		*/
		this.side1 = config.side1;

		if (!this.side1) {
			this._throw('missing Side object of side1 in the '
				+ 'encounter\'s config object');
		}

		/**
		* Side 2 for the encounter
		* 
		* @type {Faith.Encounter.Side}
		*/
		this.side2 = config.side2;

		if (!this.side2) {
			this._throw('missing Side object of side2 in the '
				+ 'encounter\'s config object');
		}

		/**
		* The neutral side for the encounter
		*
		* @type {Faith.Encounter.Side}
		*/
		this.neutral = config.neutral;

		if (!(Array.isArray(config.charsSide1)
				&& config.charsSide1.length > 0)) {
			this._throw('no characters specified for side 1; please '
				+ 'include a non-empty charsSide1 array in your '
				+ 'EncounterConfig object.');
		}

		if (!(Array.isArray(config.charsSide2)
				&& config.charsSide2.length > 0)) {
			this._throw('no characters specified for side 2; please '
				+ 'include a non-empty charsSide2 array in your '
				+ 'EncounterConfig object.');
		}

		this.props = config.props ?? {},
		this.traits = config.traits ?? [],
	}

	/**
	* The index of the current turn, e.g. turn 1, turn 2 etc.
	*
	* @type {number}
	* @default 1
	*/
	currentTurn = 1;

	/**
	* A prefix string appended to the start of every event fired by the
	* event manager.
	*
	* @type {string}
	* @default 'Encounter-'
	*/
	eventPrefix = 'Encounter-';


	/**
	* The encounter's custom game-related properties
	* 
	* @type {object.<number>}
	* @default {}
	*/
	props = {};

	/**
	* The encounter's traits
	*
	* @type {Array.<Faith.Encounter.Trait>}
	* @default []
	*/
	traits = [];

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
	//[TODO] change the docs if using some other class than javascript
	// events
	/**
	* processes a single turn. Events will be fired by the EncounterManager
	* during this turn, and a list of these events, in the order of their
	* creation, will be returned, allowing the game's graphics and audio
	* to play through the turn after it has been computed.
	*
	* @return {Array} the array of the encounter's events
	*/
	runTurn() {
		
	}

	/**
	* Throws an error and, if this.raiseAlertOnErrors is true, an alert 
	*
	* @access private
	*
	* @param {string} err - the error message
	*/
	_throw(err) {
		if (this.raiseAlertOnErrors === true) {
			alert('Error in social encounter manager: ' + err);
		}
		throw err;
	}
}

export default EncounterManager;
