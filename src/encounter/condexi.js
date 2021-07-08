/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/


/**
* A condition that requires an entity type to exist a certain number
* of times in the encounter
*
* @memberof Faith.Encounter
*/
class ExistsCondition {
	/*
	* Setup the condition. Any of the following five arguments may be
	* provided alone or in conjunction with the others: rel, kindId,
	* entityId, kindName, entityName, classes, excludedClasses. The first
	* argument of these five to be non-null gets searched within the
	* encounter's entity list, then the next one is searched within the
	* list of results found, and so on, until the results found have been
	* narrowed down. Excluded classes represent, as the name implies,
	* classes that are ignored from the final result.
	*
	* @param {String|null} [rel=null] - the relationship between the
	* entities checked and the condition's encapsulating game element (
	* which is usually another entity). Can be null, or 'same' (the entity
	* that passes will be the same as the encapsulating element), or
	* 'target' (all targets of the encapsulating game element will pass),
	* or 'holder' (the entity holding the encapsulating element, such as		* the action holding a cost, the argument holding a booster or the
	* character holding a trait, will pass), or 'creator' (the entity that
	* created the encapsulating element will pass; only applies if the
	* encapsulating element is an argument, argument trait or booster).
	*
	* @param {String|null} [kindId=null] - the unique id of the entity's
	* kind, which all entities that have the kind will share
	*
	* @param {String|null} [entityId=null] - the unique id of the entity
	* itself
	*
	* @param {String|null} [kindName=null] - the name of the entity's kind,
	* which may not be unique to a single entity kind
	* 
	* @param {String|null} [entityName=null] - the entities' name, which
	* may not be unique to a single entity
	*
	* @param {Array.<String>|null} [classes=null] - the classes that the
	* entities being checked must have 
	*
	* @param {Array.<String>|null} [excludedClasses=null] - the classes
	* that the entities being checked must not have
	*
	* @param {number|null} [number=1] - a fixed number of entities that
	* should meet the requirements in order for the condition to evaluate
	* to 'true'; if this is present, ignore the 'min' and 'max' arguments
	*
	* @param {number|null} [min=null] - the minimum number of entities that
	* should meet the requirements in order for the condition to evaluate
	* to 'true'
	*
	* @param {number|null} [max=null] - the maximum number of entities that
	* should meet the requirements in order for the condition to evaluate
	* to 'true'
	*
	* @param {String|null} [entityCode=null] - the code to be evaluated for
	* determining how many entities matching the requirements (all of
	* which are specified in the entityCode itself) exist in the encounter.
	* Use this if not using any other parameters for the requirements,
	* because this overrides those parameters. Must return an integer.
	* 
	* @param {String|null} [valueCode=null] - the code to be evaluated for
	* determining if the condition is met or not. Returns 'true' or
	* 'false'. The condition ignores the 'number', 'min' and 'max'
	* parameters when the valueCode parameter is non-null.
	*/
	constructor(
			rel=null,
			kindId=null,
			entityId=null,
			kindName=null,
			entityName=null,
			classes=null,
			excludedClasses=null,
			number=1,
			min=null,
			max=null,
			entityCode=null,
			valueCode=null
			) {
		/**
		* The relationship between the entities checked and the
		* condition's encapsulating game element; see the constructor
		* for more details.
		*
		* @private
		* @type {String|null}
		*/
		this._rel = rel;

		/**
		* The unique id of the entity's kind.
		*
		* @private
		* @type {String|null}
		*/
		this._kindId = kindId;

		/**
		* The unique id of the entity itself.
		*
		* @private
		* @type {String|null}
		*/
		this._entityId = entityId;

		/**
		* The entity kind's name.
		*
		* @private
		* @type {String|null}
		*/
		this._kindName = kindName;

		/**
		* The entities's name, which may not be unique to a single entity.
		*
		* @private
		* @type {String}
		*/
		this._entityName = entityName;

		/**
		* The classes that the entities being checked must have.
		*
		* @private
		* @type {Array.<String>|null}
		*/
		this._classes = classes;
		if (this._classes instanceof Array
				&& this._classes.length == 0) {
			this._classes = null;
		}

		/**
		* The classes that the entities being checked must not have.
		*
		* @private
		* @type {Array.<String>|null}
		*/
		this._excludedClasses = excludedClasses;
		if (this._excludedClasses instanceof Array
				&& this._excludedClasses.length == 0) {
			this._excludedClasses = null;
		}

		/**
		* A fixed number of entities that should meet the requirements
		* in order for the condition to evaluate to 'true'; see the
		* constructor for additional details.
		*
		* @private
		* @type {number|null}
		*/
		this._number = number;

		/**
		* The minimum number of entities that should meet the requirements
		* in order for the condition to evaluate to 'true'; see the
		* constructor for additional details.
 		*
		* @private
		* @type {number|null}
		*/
		this._min = min;		

		/**
		* The maximum number of entities that should meet the requirements
		* in order for the condition to evaluate to 'true'; see the
		* constructor for additional details.
 		*
		* @private
		* @type {number|null}
		*/
		this._max = max;

		/**
		* The code to be evaluated for determining how many entities
		* matching the requirements exist in the encounter.
		*
		* @private
		* @type {String|null}
		*/
		this._entityCode = entityCode;

		/**
		* The code to be evaluated for determining if the condition is
		* met or not.
		*
		* @private
		* @type {String|null}
		*/
		this._valueCode = valueCode;

		//make sure that at least one entity requirement is non-null
		if (this._rel === null && this._kindId === null
				&& this._entityId === null && this._kindName === null
				&& this._entityName === null && this._classes === null
				&& this._excludedClasses === null
				&& this._entityCode === null) {
			throw 'Invalid arguments in existsCondition: at least one '
				+ 'of \'rel\', \'kindId\', \'entityId\', \'kindName\',
				+ '\'entityName\', \'classes\' or \'excludedClasses\'
				+ 'must be non-null.'
		}

		if (this._rel) {
			//make sure that rel is valid
			switch (this._rel) {
				case 'same':
				case 'target':
				case 'holder':
				case 'creator':
				break;
				default:
					throw 'Invalid rel argument in existsCondition: '
					+ 'must be either null, \'same\', \'target\', '
					+ '\'holder\' or \'creator\'.'
			}
		}

		if (this._number === null && this._min === null
				&& this._max === null && this._valueCode === null) {
			throw 'Invalid arguments in existsCondition: at least one of '
				+ '\'number\', \'min\', \'max\' and \'valueCode\' must '
				+ 'be non-null';
		}
	}

	/**
	* Check if the condition evaluates to 'true'
	* 
	* @param {Faith.Encounter.EncounterManager} encounter - the encounter
	* in which the condition is tested
	*
	* @param {Faith.Encounter.Entity|Faith.Encounter.Cost} elem - the
	* game element encapsulating the condition
	* 
	* @return {boolean} - whether or not the condition evaluates to 'true'
	*/
	check(encounter, elem) {
		//[TODO] see if elem can be other types besides Entity and Cost
		let entities = [];

		if (this._rel !== null) {
			switch (this._rel) {
				case 'same':
					entities.push(elem);
					break;
				case 'target':
					if (elem instanceof Action) {
						for (let target in elem.targets
					}



			}

		}


	/*
	* @param {String|null} [rel=null] - the relationship between the
	* entities checked and the condition's encapsulating game element (
	* which is usually another entity). Can be null, or 'this' (the entity
	* that passes will be the same as the encapsulating element), or
	* 'target' (all targets of the encapsulating game element will pass),
	* or 'holder' (the entity holding the encapsulating element, such as		* the action holding a cost, the argument holding a booster or the
	* character holding a trait, will pass), or 'creator' (the entity that
	* created the encapsulating element will pass; only applies if the
	* encapsulating element is an argument, argument trait or booster).
	*
	* @param {String|null} [kindId=null] - the unique id of the entity's
	* kind, which all entities that have the kind will share
	*
	* @param {String|null} [entityId=null] - the unique id of the entity
	* itself
	*
	* @param {String|null} [kindName=null] - the name of the entity's kind,
	* which may not be unique to a single entity kind
	* 
	* @param {String|null} [entityName=null] - the entities' name, which
	* may not be unique to a single entity
	*
	* @param {Array.<String>|null} [classes=null] - the classes that the
	* entities being checked must have 
	*
	* @param {Array.<String>|null} [excludedClasses=null] - the classes
	* that the entities being checked must not have
	*/


		//[TODO]


	}
}
