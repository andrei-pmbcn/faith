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
	* provided alone or in conjunction with the others: rel, typeId,
	* entityId, name, classes. The first argument of these five to be
	* non-null gets searched within the encounter's entity list, then the
	* next one is searched within the list of results found, and so on,
	* until the results found have been narrowed down.
	*
	* @param {String|null} rel - the relationship between the entities
	* checked and the condition's encapsulating game element (which is
	* usually another entity). Can be null, or 'same' (the entity checked
	* is the same as the encapsulating element), or 'target' (all targets
	* of the encapsulating game element are checked), or 'holder' (the
	* entity holding the encapsulating element, such as the action holding
	* a cost, the argument holding a booster or the character holding a
	* trait, is checked), or 'creator' (the entity that created the
	* encapsulating element, only applies if the entity is an argument,
	* argument trait or booster).
	*
	* @param {String} typeId - the unique id of the entity's type, which
	* many entities may share
	*
	* @param {number} entityId - the unique id of the entity itself
	*
	* @param {String} name - the entities's name, which may not be unique
	* to a single entity
	*
	* @param {Array.<String>} classes - the classes of the entities being
	* checked
	*
	* @param {number} number - a fixed number 
	*/
	constructor(
			rel=null,
			typeId=null,
			entityId=null,
			name=null,
			classes=null,
			number=1,
			min=null,
			max=null,
			entityCode=null,
			valueCode=null
			) {
	}

	/**
	* Check if the condition is 
	check(encounter) {


	}
}
