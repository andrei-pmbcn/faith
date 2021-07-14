/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { Entity, EntityKind } from './entity.js';

/* A list that can be searched by name, classes and id.
* Get its entries by id using <list>['<id>'].
* 
* @memberof Faith.Encounter
*/
class List {
	constructor() {
		/**
		* The elements of the list that are treated as defaults.
		*
		* @type {Object}
		*/
		this._defaults = {};
	}

	/**
	* Adds an entity or entityKind to the list
	* 
	* @param {Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* obj - the entity or entityKind to be added
	* @return {Faith.Encounter.List} the list itself
	*/
	add(obj) {
		if (!obj instanceof Entity && !obj instanceof EntityKind) {
			throw 'invalid entity or entityKind to be added: must be of '
				+ 'type Faith.Encounter.Entity or '
				+ 'Faith.Encounter.EntityKind or one of their subclasses, '
				+ 'e.g. Faith.Encounter.Argument or '
				+ 'Faith.Encounter.ArgumentKind'
		}

		if (!obj.id || typeof obj.id !== 'string') {
			throw 'invalid id for entity or entityKind to be added: '
				+ 'must be a string'
		}
		
		if (typeof this[obj.id] === 'undefined') {
			this[obj.id] = obj;
			if (obj.isDefault) {
				this._defaults[obj.id] = obj;
			}
		} else {
			throw 'Entity with id ' + obj.id + 'already exists in the list.'
		}


		return this;
	}

	/**
	* Removes an entity or entityKind from the list
	* 
	* @param {Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* obj - the entity or entityKind to be removed
	* @return {Faith.Encounter.List} the list itself
	*/
	remove(obj) {
		if (typeof (this[obj.id] !== 'undefined'))
			delete this[obj.id];
			if (obj.isDefault) {
				delete this._defaults[obj.id];
			}
		}
		return this;
	}

	/**
	* Returns a list of the entries that have a specified name.
	*
	* @param {String} name - the name of the entries to be returned
	* @return {Array.<Faith.Encounter.Entity|Faith.Encounter.EntityKind>}
	* the entries returned
	*/
	getByName(name) {
		let entries = [];
		for (let entry of Object.keys(this)) { 
			if (this[entry].name === name) {
				entries.push(this[entry]);
			}
		}
		return entries;
	}

	/**
	* Returns a list of entries that have the specified classes.
	*
	* @param {Set.<String>} classes - the set of classes to be searched
	* for
	* @return {Array.<Faith.Encounter.Entity|Faith.Encounter.EntityKind>}
	* the entities returned
	*/
	getByClasses(classes) {
		let entries = [];
		for (let entry of Object.keys(this)) {
			let nFound = 0;
			for (let cls of this[entry].classes.values()) {
				if (classes.has(cls)) {
					nFound++
				}
			}
			if (nFound === classes.length) {
				entries.push(this[entry]);
			}
		}
		return entries;
	}
}
export { List };
