/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import Entity from './entity.js';

/* A list that can be searched by entity name and entity id.
* Get its entries by id using its `get` method,
* access the whole list using its `list` member.
* 
* @memberof Faith.Encounter
*/
class List {
	constructor() {
		/**
		* The list itself.
		* @type {Array}
		*/
		this.list = [];
	}

	/**
	* Adds any number of entities to the list
	* 
	* @param {...Faith.Encounter.Entity} args - the entities to be added
	* @return {Faith.Encounter.List} the list itself
	*/
	add(...args) {
		for (let arg of args) {
		if (!args instanceof Entity) {
			throw 'invalid entity type to be added: must be of type '
				+ 'Faith.Encounter.Entity or one of its subclasses, '
				+ 'e.g. Faith.Encounter.Argument.'
			}
		}
		this.list.push(...args);
		return this;
	}

	/**
	* Returns the entry that has a specified id. All game entities must
	* have distinct ids.
	*
	* @param {string} id - the id of the entry to be returned
	* @return {Faith.Encounter.Entity} the entry returned
	*/
	getById(id) {
		for (let entry of this.list) {
			if (entry.id === id) {
				return entry;
			}
		}
		return null;
	}

	/**
	* Returns a list of the entries that have a specified name.
	*
	* @param {string} name - the name of the entries to be returned
	* @return {Array.<Faith.Encounter.Entity>} the entries returned
	*/
	getByName(name) {
		var entries = [];
		for (let entry of this.list) { 
			if (entry.name === name) {
				entries.push(entry);
			}
		}
		return entries;
	}
}
