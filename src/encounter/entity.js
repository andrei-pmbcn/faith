/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import Interpreter from 'js-interpreter';
import { List } from './list.js';

/**
* An Entity, such as an Argument, a Character or a Booster. It may only
* belong to at most one encounter.
*
* @memberof Faith.Encounter
* @mixes Faith.Encounter.codeMixin
*/
class Entity {
	/**
	* Creates the entity.
	*
	* @param {Faith.Encounter.EncounterManager} manager - the encounter
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
	* @param {String} side - the side that the entity will have. Can be
	* 1, 2 or(for the neutral side) 0
	*
	* @param {String|null} [id=null] - the id of the entity; if you do not
	* specify it, an id for the entity will be auto-generated by the
	* encounter to which the entity is added.
	*
	* @param {Set.<String>|null} [classes=null] - the optional list of the
	* entity's XML-style classes, which are useful in distinguishing
	* the entity from others of its kind.
	*
	* @param {Faith.Encounter.List.<Faith.Encounter.Property>|null} props -
	* the list storing the entity's properties.
	*/
	constructor(manager, kind, name, side, id=null, classes=null, props=null) {
		/**
		* The encounter manager to which the entity belongs.
		*
		* @type {Faith.Encounter.EncounterManager}
		*/
		this.manager = manager;

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
		* The entity's side. Can be 1 for side1, 2 for side2 or 0 for the
		* neutral side.
		*
		* @type {number}
		*/
		this.side = side;

		/**
		* The entity's id; if set to null, it will be auto-assigned as a
		* hash when the entity is added to an encounter manager.
		*
		* @type {String}
		*/
		this.id = id;

		/**
		* The Set of the entity's own XML-style classes
		*
		* @type {Set.<String>}
		*/
		this.classes = classes ?? new Set();
		if (!this.classes instanceof Set) {
			throw 'Invalid classes array for entity ' + this.id ?? ''
				+ ': must be an Object of type Set.'
		}

		if typeof (this.kind.classes !== 'undefined') {
			for (let cls of this.kind.classes.values()) {
				this.classes.add(cls);
			}
		}

		/**
		* The object storing the entity's properties. Access properties
		* using <entity>.props.<property>.
		* 
		* @type {Faith.Encounter.List.<Faith.Encounter.Property>}
		*/
		this.props = props ?? new List();

		if (typeof this.kind.props !== 'undefined') {
			for (let prop of this.kind.props) {
				if (typeof this.props[prop.id] === 'undefined') {
					this.props[prop.id] = prop;
				}
			}
		}
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
* @mixes Faith.Encounter.codeMixin
*/
class EntityKind {
	/**
	* creates the entity kind. Do not call new EntityKind() directly,
	* rather call one of its subclasses' constructors, such as
	* ArgumentKind() or BoosterKind()
	*
	* @param {Faith.Encounter.Ruleset} ruleset - the ruleset to which this
	* entityKind belongs.
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
	* @param {Faith.Encounter.List.<Faith.Encounter.Property>|null} props -
	* the list storing the entityKind's properties.
	*/
	constructor(ruleset, id, name, classes=null, props=null) {
		/**
		* The ruleset to which this entityKind belongs.
		*
		* @type {Faith.Encounter.Ruleset}
		*/
		ruleset = null;

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
		* The array of XML-style classes assigned to this entityKind.
		* 
		* @type {Set.<String>}
		*/

		this.classes = classes ?? new Set();

		/**
		* The properties attached to this entityKind.
		*
		* @type {Faith.Encounter.List.<Faith.Encounter.Property>}
		*/
		this.props = props ?? new List();
	}

	/**
	* Serializes the entity into a string.
	*/
	serialize() {
		//[TODO]

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
		if (!(this.id && this.id instanceof String)) {
			throw 'Entity ' + this.name
				+ ' found without a valid id. Please set its id to '
				+ 'a unique string, with words separated by hyphens '
				+ '(-).';
		}

		return this;
	}

	/**
	* Unserializes the entity from a string.
	*
	* @static
	*/
	static unserialize() {
		//[TODO]
	}
}

/**
* Provides methods for adding and removing traits, as well as a traits
* list.
*
* @mixin
* @memberof Faith.Encounter
*/
const traitMixin = {
	/**
	* Adds a trait to the entity or entityKind's traits list.
	* 
	* @param {Faith.Encounter.Trait} trait - the trait to be added.
	*/
	addTrait(trait) {
		this.traits.add(trait);
	},

	/**
	* Removes a trait from the entity or entityKind's traits list.
	* 
	* @param {Faith.Encounter.Trait} trait - the trait to be removed.
	*/
	removeTrait(trait) {
		this.traits.remove(trait);
	},
}

/**
* Provides methods for running scripts within the social encounter engine.
* EntityKinds (costs and conditions) use it, as do entities
* (effects and properties).
*
* The code will take environmental variables from `this.env`, in addition
* to all its default environmental variables.
*
* @mixin
* @memberof Faith.Encounter
*/
const codeMixin = {
	runCode() {
		// Create the environment for the code, including all default
		// variables.


		//[TODO] get property values using <property>.value
	}
}

Object.assign(Entity.prototype, codeMixin);
Object.assign(EntityKind.prototype, codeMixin);


/**
* A target specification, describing a target or holder to be searched
* for in the targetMixin's methods
*
* @typedef targetSpec
* @memberof Faith.Encounter
*
* @property {String|null} target - the string describing the type of target
* to be searched for
*
* @property {String|null} side - the side to be searched in
*
* @property {String|null} finished - if true, matches only finished entities;
* if false, only unfinished entities
*
* @property {String|null} active - if true, matches only active entities;
* if false, matches only inactive entities
*
* @property {String|null} alive - if true, matches only living entities;
* if false, matches only dead entities
*
* @property {String|null} code - the code to be executed to compile the list
* of targets
*/
const targetSpec = {
	target: null,
	side: null,
	finished: null,
	active: null,
	alive: null,
	code: null,
}

/**
* The methods used in getting targets that fit a specification and checking
* whether a given entity is a target
*
* @mixin
* @memberof Faith.Encounter
*/
const targetMixin = {
	/**
	* Determines whether the given entity is a target of the specified
	* targetSpec.
	*
	* @param {Faith.Encounter.Entity} candidate - the entity to be checked
	*
	* @param {Faith.Encounter.Entity} targeter - the entity attempting the
	* targeting
	*
	* @param {Faith.Encounter.targetSpec} targetSpec - the target
	* specification to be compared against
	*
	* @return {Boolean} whether the candidate is a target
	*/
	isTarget(candidate, targeter, targetSpec) {
		//[TODO]

	}

	/**
	* Gets all the targets with the given specification
	*
	* @param {Faith.Encounter.Entity} candidate - the entity to be checked
	* @param {Faith.Encounter.Entity} targeter - the entity attempting the
	* targeting
	* @param {Faith.Encounter.targetSpec} targetSpec - the target
	* specification to be compared against
	* 
	* @return {Array.<Faith.Encounter.Entity>} the targets found
	*/
	getTargets(targeter, targetSpecs) {
		//[TODO]

	}
}


export { Entity, traitMixin, targetMixin, EntityKind };

