/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

//import PropertyCondition from './condprop.js';
import ExistsCondition from './condexi.js';
import { EntityKind } from './entity.js';

//[TODO] Rollback costs if any of them fails
//[TODO] When evaluating the XML for a cost, ensure that <value></value>
// does not contain a code string, but rather, <valueCode></valueCode> does,
// and that <target></target> likewise does not contain a code string,
// but rather, <targetCode></targetCode> does.
// [TODO] <cost basic="true">...</cost>

/**
* A cost for an action to be performed or an entity to be created,
* represents how much a given property will be altered by performing
* the action / adding the entity to the encounter.
*
* @memberof Faith.Encounter
*/
class Cost extends EntityKind {
	/**
	* Creates the cost.
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
	* Faith.Encounter.Entity or list of Entities.
	* 
	* @param {Array.<Faith.Encounter.Condition> [conds] - the array of
	* conditions that must be met after processing the cost (i.e. once the
	* new value of the property would be in place) in order for
	* the cost to be fulfillable. For instance, the default condition, 
	* which is used if the user ignores this argument when calling the
	* constructor or when <cost basic="true">...</cost> is used as the XML
	* rule for the cost instead of <cost>...</cost>, is that the minimum
	* value of the property to be altered will be zero after the cost is
	* deducted from it.
	*/
	constructor(
		id,
		property,
		value,
		target='agent',
		conds=null,
		classes=null,
		
	) {
		super(id, null, classes, null);
		delete this.name;
		delete this.props;

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
		switch(this._target) {
			case 'agent':
				return [agent];
			case 'side':
				return [agent.encounter.sides[agent.side]];
			case 'holder':			
				return [holder];
			default:
				// code is to be evaluated
				
		}
	}

	/**
	* Perform the cost. If the cost fails to be applied (because a
	* condition is not met), it returns false; if it succeeds,
	* it returns true.
	*
	* @param {Faith.Encounter.Character} agent - the agent that performs the
	* action or creates the entity that will cost
	*
	* @param {Faith.Encounter.Entity} holder - the entity that 'holds' the
	* cost, be it the action that costs to be performed, or the trait or
	* argument or booster that costs to be created.
	*/
	run(agent, holder) {
	

	
	}

	_runCode(code, agent, holder) {
		itp = new Interpreter(code); //'itp' stands for 'interpreter'

		

		
	}
}
export default Cost;
