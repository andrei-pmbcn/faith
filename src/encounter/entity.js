/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/**
* An Entity, such as an Argument, a Character or a Booster.
*
* @memberof Faith.Encounter
*/
export class Entity {
	/**
	* Creates the entity.
	*
	* @param {Faith.Encounter.EncounterManager} encounter - the encounter
	* manager to which the entity belongs
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
	* @param {String} [id=null] - the optional id of the entity
	*
	* @param {Array.<String>} [classes=[]] - the optional list of the
	* entity's HTML-style classes, which are useful in distinguishing
	* the entity from others of its kind; note that the entity's kind
	* has a separate class list and both lists are searched when
	* looking for an entity with a given class.
	*/
	constructor(encounter, kind, name, id=null, classes=[]) {
		/**
		* The encounter manager to which the entity belongs.
		*
		* @type {Faith.Encounter.EncounterManager}
		*/
		this.encounter = encounter;

		/**
		* The kind to which the entity belongs.
		*
		* @type {Faith.Encounter.EntityKind}
		*/
		this.kind = kind;

		/**
		* The name of the entity.
		*
		* @type {String}
		*/
		this.name = name;

		/**
		* The entity's id; can be null.
		*
		* @type {String|null}
		*/
		this.id = id;

		/**
		* The list of the entity's own HTML-style classes; can be null.
		*
		* @type {Array.<String>|null}
		*/
		this.classes = classes;
		//[TODO]
	}


}



/**
* A game entity kind, such as an argument kind, a booster kind or an
* effect kind. All entity kinds extend this class. Individual entities
* created within an encounter each belong to an entity kind. If you have
* a trait called 'rhetorical fever', that is an entity kind, more
* specifically a TraitKind. Individual occurrences of the 'rhetorical
* fever' trait are individual Trait entities. 
*
* @memberof Faith.Encounter
*/
export class EntityKind {
	/**
	* creates the entity kind. Do not call new EntityKind() directly,
	* rather call one of its subclasses' constructors, such as
	* ArgumentKind() or BoosterKind()
	*
	* @param {Faith.Encounter.Ruleset} ruleset - the ruleset that this
	* entity kind belongs to
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
	* @param {Array.<String>} [classes=[]] - a list of HTML-style classes
	* that all entities of this entityKind will possess; these allow
	* effects to target only certain types of other entities that have a
	* given class, for instance.
	*
	* @param {Array.<Faith.Encounter.Property>} [props=[]] - a list of
	* properties that this entityKind will possess, in addition to those
	* it inherits.
	*/
	constructor(ruleset, id, name, classes=[], props=[]) {
		/**
		* The ruleset to which this entityKind belongs.
		*
		* @type {Faith.Encounter.Ruleset}
		*/

		/**
		* The id string of the entityKind. Must be unique among all
		* entityKinds in the ruleset (so preface it by 'action-',
		* 'argument-' etc. to make sure it does not clash with entityKinds
		* of different types).
		*
		* @type {String}
		*/
		this.id = id;

		/**
		* The name of the entity; can be non-unique.
		*
		* @type {String}
		*/
		this.name = name;

		/**
		* The array of HTML-style classes assigned to this entity.
		* 
		* @type {Array.<String>}
		*/

		this.classes = classes;
	}	

	/**
	* Validates the entity, making sure its data members are correct.
	* Use this particularly when checking whether XML content parsed
	* by the Ruleset is correct. May be called directly but should
	* ideally be called by the Rulset's validate() method.
	*
	* @return {Faith.Encounter.EntityKind} the entityKind itself.
	*/
	validate() {
		if (!(this.id && this.id instanceof String)) {
			throw 'Entity ' + this.name
				+ ' found without a valid id. Please set its id to '
				+ 'a unique string, with words separated by hyphens '
				+ '(-).';
		}
		if (!this.name instanceof String) {
			throw 'The name of entity ' + this.id + 'is not a String.';
		}

		return this;
	}
}

