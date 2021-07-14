/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { Entity, traitMixin, EntityKind } from './entity.js';
import { List } from './list.js';

/**
* An Encounter, storing global information about the encounter such as
* the encounter's properties and traits. This is NOT the same as the
* EncounterManager, which is what actually handles giving orders to 
* characters, processing the turns and so on.
*
* @memberof Faith.Encounter
* @mixes Faith.Encounter.traitMixin
*/
class Encounter extends Entity {
	/**
	* Creates the encounter.
	* 
	* @param {Faith.Encounter.EntityKind} kind - the kind to which the
	* entity belongs; for instance, one can define a TraitKind called
	* 'rhetorical fever' and instantiate that TraitKind in four different
	* Trait entities each owned by a different character. 
	*
	* @param {String} name - the name of the entity, which may not be
	* unique and which gets displayed in-game. Non-uniqueness is helpful
	* when, for instance, having three different NPCs with the name
	* 'guard'.
	*
	* @param {Set.<String>|null} [classes=null] - the optional list of the
	* entity's XML-style classes, which are useful in distinguishing
	* the entity from others of its kind.
	* 
	* @param {Faith.Encounter.List.<Faith.Encounter.Property>|null} props -
	* the list storing the entity's properties.
	*
	* @param {Faith.Encounter.List.<Faith.Encounter.Trait>|null} traits -
	* the list storing the entity's traits.
	*/
	constructor(kind, name, classes=null, props=null, traits = null) {
		super(kind, name, null, null, classes, props);	

		delete this.side;
		delete this.id;

		/**
		* The entity's traits.
		* 
		* @type {Faith.Encounter.List}
		*/
		this.traits = traits ?? new List();
	}
}

Object.assign(Encounter.prototype, traitMixin);


/**
* An EncounterKind, to be used by all encounters of the given kind. Stores
* the general rules for the encounter, its victory conditions and so on.
*
* @memberof Faith.Encounter 
* @mixes Faith.Encounter.traitMixin
*/
class EncounterKind extends EntityKind {
	/**
	* creates the entity kind. Do not call new EntityKind() directly,
	* rather call one of its subclasses' constructors, such as
	* ArgumentKind() or BoosterKind()
	*
	* @param {String} id - the id string of the entity kind. Must be
	* unique among all entity kinds in the ruleset (so preface it by
	* 'action-', 'argument-' etc. to make sure it does not clash with
	* entities of different kinds). Do not use spaces in it, use
	* hyphens instead.
	*
	* @param {String} name - the entity kind's name, which gets
	* displayed to the player. It does not have to be unique, unlike the
	* id.
	*
	* @param {Set.<String>} [classes=new Set()] - a list of XML-style
	* classes that all entities of this entityKind will possess; these
	* allow effects to target only certain types of other entities that
	* have a given class, for instance.
	*
	* @param {Array.<Faith.Encounter.Property>} props - the properties
	* attached to this entityKind
	*/
	constructor(id, name, classes=null, props=null, traits=null) {
		super(id, name, classes, props);

		classes.add('encounter');		

		/**
		* The entityKind's traits.
		* 
		* @type {Faith.Encounter.List}
		*/
		this.traits = traits ?? new List();
	}

	/**
	* Validates the entityKind, making sure its data members are adequate
	* for use by encounters. Use this particularly when checking whether
	* XML content parsed by the Ruleset is correct. May be called directly
	* but should ideally be called by the Rulset's validate() method.
	*
	* @return {Faith.Encounter.EntityKind} the entityKind itself.
	*/
	validate() {
		super.validate();
		//[TODO]
	}
}

Object.assign(EncounterKind.prototype, traitMixin);

/* Undocumented function, used in ruleset.js
* Parses an encounterKind into the ruleset.
* 
* @param {Object} rule - the XML node being parsed
* @param {String} mode - either 'replace', 'alter' or 'delete'; determines
* what will happen to previous instances of the same rule
*/
function _parseEncounterKind(rule, mode) {
	let id = null;
	let name = null;
	let classes = null;
	let props = null;
	let traits = null;
	
	for (let iAttr=0; iAttr < rule.attributes.length; iAttr++) {
		let attr = rule.attributes[iAttr];

		switch(attr.name) {
			case 'id':
				
			case '':
			//[TODO]
			default:
				this._throwParserError(
					"Invalid attribute name for encounter rule: "
					+ attr.name + ". Please provide a valid attribute "
					+ "name as described in the manual."
		}
	}
	//[TODO]
	
	let encounterKind = new EncounterKind();
	
}

export { Encounter, EncounterKind, _parseEncounterKind };
