/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

Import Condition from './condition.js';


class Cost {
	/**
	* A cost for an action to be performed or an entity to be created,
	* represents how much a given property will be altered by performing
	* the action / adding the entity to the encounter.
	*
	* @param {String} property - the name of the property to be modified
	*
	* @param {boolean|number|String} value - If a boolean, the property's
	* value at the end of processing the cost. If a a number, the amount
	* deducted from the property. If a string, the code to be run in order
	* to evaluate this property's new value, which must return the new
	* value.
	* 
	* @param {String} [target='agent'] - the entity holding the property
	* to be changed; either 'agent' (meaning the entity that is performing
	* the action / creating the entity that costs), 'side' (meaning the
	* side of the agent that is performing the action / creating the
	* entity that costs), 'holder' (meaning the action that is to be
	* performed or the entity that is to be created) or a string that
	* specifies the code to be run in order to evaluate the target or
	* targets, in which case the code must return a single
	*Faith.Encounter.Entity or list of Entities.
	* 
	* @param {Array.<Faith.Encounter.Condition>} [conds] - the array of
	* conditions that must be met after processing the cost (i.e. once the
	* new value of the property would be in place) in order for
	* the cost to be fulfillable. For instance, the default condition, 
	* which is used if the user ignores this argument when calling the
	* constructor or when <cost basic="true">...</cost> is used as the XML
	* rule for the cost instead of <cost>...</cost>, is that the minimum
	* value of the property to be altered will be zero after the cost is
	* deducted from it. Note that all conditions must test for the
	* property's putative value, not its current value, because the
	* tests occur before its value is actually changed.
	*
	* [TODO] <cost basic="true">...</cost>
	*/
	constructor(
		property,
		value,
		target='agent',
		conds=null,
	) {
		/**
		* the name of the property to be modified
		*
		* @private
		* @type {String}
		*/
		this._property = property;

		/**
		* If a boolean, the property's value at the end of processing the
		* cost. If a a number, the amount deducted from the property.
		* If a string, the code to be run in order to evaluate this
		* property's new value, which must return the new value.
		*
		* @private
		* @type {boolean|number|String}
		*/
		this._value = value;

		/**
		* the entity holding the property to be changed; see the
		* constructor for details.
		*
		* @private
		* @type {String}
		*/
		this._target = target;

		/**
		* the array of conditions that must be met after processing the
		* cost. See the constructor for details.
		*
		* @private
		* @type {Array.<Faith.Encounter.Condition>}
		*/
		if (conditions !== null) {
			this._conds = conditions;
		} else {
			//[TODO] setup the basic condition
		

		}
	}

	/**
	* Gets the targets of the cost.
	*
	* @param {Faith.Encounter.Character} agent - the agent that performs the
	* action or creates the entity that will cost
	*
	* @param {Faith.Encounter.Entity} holder - the entity that 'holds' the
	* cost, be it the action that costs to be performed, or the trait or
	* argument or booster that costs to be created.
	*
	* @return {Array.<Faith.Encounter.Entity>} the entities that the cost
	* will affect
	*/
	getTargets(agent, holder) {

	}

	/**
	* Evaluate the cost, altering the 'prospective' versions of the
	* property in the targets.
	*
	* @param {Faith.Encounter.Character} agent - the agent that performs the
	* action or creates the entity that will cost
	*
	* @param {Faith.Encounter.Entity} holder - the entity that 'holds' the
	* cost, be it the action that costs to be performed, or the trait or
	* argument or booster that costs to be created.
	*/
	evaluate(agent, holder) {
	// NOTE: valueCode should check the prospective, not current, version
	// of the property in the targets, because the prospective version
	// is the one that gets altered as more costs are stacked up, so if
	// two costs each check if, for instance, a property is above zero
	// after deducting 10 from it, the second cost should check if the
	// property's prospective value will be above zero after both costs
	// have deducted from it. This is something the engine itself must
	// ensure.

	}
	
	/**
	* Perform the cost, altering the 'current' versions of the property
	* in the targets.
	*
	* @param {Faith.Encounter.Character} agent - the agent that performs the
	* action or creates the entity that will cost
	*
	* @param {Faith.Encounter.Entity} holder - the entity that 'holds' the
	* cost, be it the action that costs to be performed, or the trait or
	* argument or booster that costs to be created.
	*/
	perform(agent, holder) {
		
	}
}
export default Cost;
