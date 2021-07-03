/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/**
* A game entity, such as an argument, a booster or an effect. All entity
* types extend this class. 
*
* @memberof Faith.Encounter
*/
class Entity {
	/**
	* creates the entity. Do not call new Entity() directly, rather call
	* one of its sublcasses' constructors, such as Argument() or Booster()
	*
	* @param {Faith.Encounter.Ruleset} ruleset - the ruleset that this
	* entity belongs to
	*
	* @param {String} id - the id string of the entity. Must be unique
	* among all entities in the ruleset (so preface it by 'action-',
	* 'argument-' etc. to make sure it does not clash with entities of
	* different types).
	*
	* @param {String} name - the entity's name. It does not have to be
	* unique, unlike the id.
	*
	* @param {Array.<String>} classes - a list of HTML-like classes that
	* the entity possesses; these allow effects to target only certain
	* types of other entities.
	*/
	constructor(ruleset, id, name, classes) {
		/**
		* The ruleset to which this entity belongs.
		*
		* @type {Faith.Encounter.Ruleset}
		*/

		/**
		* The EncounterManager object of the entity's encounter;
		* only set for entities that are present in encounters,
		* not the prototype entities within rulesets. 
		*
		* @type {Faith.Encounter.EncounterManager}
		*/
		this.encounter = null;

		/**
		* The id string of the entity. Must be unique among all entities
		* in the ruleset (so preface it by 'action-', 'argument-' etc. to
		* make sure it does not clash with entities of different types).
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
	* @return {Faith.Encounter.Entity} the entity itself.
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

export default Entity;
