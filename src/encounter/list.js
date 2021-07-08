/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { Entity, EntityKind } from './entity.js';

/* A list that can be searched by name and id.
* Get its entries by id using its `get` method,
* access the whole list using its `list` member.
* 
* @memberof Faith.Encounter
*/
class List {
	constructor() {
		/**
		* The list itself.
		*
		* @type {Array}
		*/
		this.list = [];
	}

	/**
	* Adds any number of entities or entityKinds to the list
	* 
	* @param {...Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* args - the entities or entityKinds to be added
	* @return {Faith.Encounter.List} the list itself
	*/
	add(...args) {
		for (let arg of args) {
		if (!args instanceof Entity && !args instanceof EntityKind) {
			throw 'invalid entity or entityKind to be added: must be of '
				+ 'type Faith.Encounter.Entity or '
				+ 'Faith.Encounter.EntityKind or one of their subclasses, '
				+ 'e.g. Faith.Encounter.Argument or '
				+ 'Faith.Encounter.ArgumentKind'
			}
		}
		this.list.push(...args);
		return this;
	}

	/**
	* Removes any number of entities or entityKinds from the list
	* 
	* @param {...Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* args - the entities or entityKinds to be removed
	* @return {Faith.Encounter.List} the list itself
	*/
	remove(...args) {
		for (let arg of args) {
			// skip over the argument if it is not found because
			// splicing with splice(-1, 1) means splicing the
			// second-to-last entry of the array, which we do not want
			// if the argument is not found.
			if (this.list.indexOf(arg) === -1)
				continue;
			this.list.splice(this.list.indexOf(arg), 1);
		}
		return this;
	}

	/**
	* Returns the entry that has a specified id. All game entity kinds must
	* have distinct ids, while entities may not have ids.
	*
	* @param {String} id - the id of the entry to be returned
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
	* @param {String} name - the name of the entries to be returned
	* @return {Array.<Faith.Encounter.Entity|Faith.Encounter.EntityKind>}
	* the entries returned
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
export default List;
