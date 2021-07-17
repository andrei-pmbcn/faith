/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { Entity, EntityKind } from './entity.js';

/** 
* A map whose members can be accessed using <map>['<id>']. It can be searched
* by name and classes.
* 
* @memberof Faith.Encounter
*/
class Map {
	constructor() {
		/**
		* The elements of the list that are treated as defaults.
		*
		* @type {Object}
		*/
		this._defaults = {};
	}

	/**
	* Adds an entity or entityKind to the map
	* 
	* @param {Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* obj - the entity or entityKind to be added
	*
	* @return {Faith.Encounter.Map} the map itself
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
	* Removes an entity or entityKind from the map
	* 
	* @param {Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* obj - the entity or entityKind to be removed
	*
	* @return {Faith.Encounter.Map} the map itself
	*/
	remove(obj) {
		if (typeof (this[obj.id] !== 'undefined')) {
			delete this[obj.id];
			if (obj.isDefault) {
				delete this._defaults[obj.id];
			}
		}
		return this;
	}

	/**
	* Returns an array of the entries that have a specified name.
	*
	* @param {String} name - the name of the entries to be returned
	*
	* @return {Array.<Faith.Encounter.Entity|Faith.Encounter.EntityKind>}
	* the entries returned
	*/
	getByName(name) {
		let entries = [];
		for (let id of Object.keys(this)) { 
			if (this[id].name === name) {
				entries.push(this[id]);
			}
		}
		return entries;
	}

	/**
	* Returns an array of entries that have all of the specified classes.
	*
	* @param {Set.<String>} classes - the set of classes to be searched
	* for
	*
	* @return {Array.<Faith.Encounter.Entity|Faith.Encounter.EntityKind>}
	* the entities returned
	*/
	getByClasses(classes) {
		let entries = [];
		for (let id of Object.keys(this)) {
			let nFound = 0;
			for (let cls of this[id].classes.values()) {
				if (classes.has(cls)) {
					nFound++
				}
			}
			if (nFound === classes.length) {
				entries.push(this[id]);
			}
		}
		return entries;
	}
}



/** 
* A list whose members can be accessed using <list>.list[index]. It can be
* searched by id, name and classes.
* 
* @memberof Faith.Encounter
*/
class List {
	constructor() {
		/**
		* The contents of the list
		*
		* @type {Array}
		*/
		this.list = []
	}

	
	/**
	* Adds an entity or entityKind to the list
	* 
	* @param {Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* obj - the entity or entityKind to be added
	*
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

		if (this.list.indexOf(obj) === -1) {
			this.list.push(obj);
		}
		return this;
	}

	/**
	* Removes an entity or entityKind from the list
	* 
	* @param {Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* obj - the entity or entityKind to be removed
	*
	* @return {Faith.Encounter.List} the list itself
	*/
	remove(obj) {
		let index = this.list.indexOf(obj);
		if (index !== -1) {
			this.list.splice(index, 1);
		}
		return this;
	}

	/**
	* Returns the entry that has the specified id.
	*
	* @param {String} id - the id of the entries to be returned
	*
	* @return {Faith.Encounter.Entity|Faith.Encounter.EntityKind}
	* the entry returned
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
	* Returns an array of the entries that have a specified name.
	*
	* @param {String} name - the name of the entries to be returned
	*
	* @return {Array.<Faith.Encounter.Entity|Faith.Encounter.EntityKind>}
	* the entries returned
	*/
	getByName() {
		let entries = [];
		for (let entry of this.list) { 
			if (entry.name === name) {
				entries.push(entry);
			}
		}
		return entries;
	}

	/**
	* Returns an array of entries that have all of the specified classes.
	*
	* @param {Set.<String>} classes - the set of classes to be searched
	* for
	*
	* @return {Array.<Faith.Encounter.Entity|Faith.Encounter.EntityKind>}
	* the entities returned
	*/
	getByClasses(classes) {
		let entries = [];
		for (let entry of this.list) {
			let nFound = 0;
			for (let cls of entry.classes.values()) {
				if (classes.has(cls)) {
					nFound++
				}
			}
			if (nFound === classes.length) {
				entries.push(entry);
			}
		}
		return entries;
	}
}

export { Map, List };
