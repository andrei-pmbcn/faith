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
	* to evaluate this property's new value.
	* 
	* @param {String} [target='agent'] - the entity holding the property
	* to be changed; either 'agent' (meaning the entity that is performing
	* the action / creating the entity that costs), 'side' (meaning the
	* side of the agent that is performing the action / creating the
	* entity that costs), 'object' (meaning the action that is to be
	* performed or the entity that is to be created) or a string that
	* specifies the code to be run in order to evaluate this target.
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
		* @type {String}
		*/
		this.property = property;

		/**
		* If a boolean, the property's value at the end of processing the
		* cost. If a a number, the amount deducted from the property.
		* If a string, the code to be run in order to evaluate this
		* property's new value.
		*
		* @type {boolean|number|String}
		*/
		this.value = value;

		/**
		* the entity holding the property to be changed; either 'agent'
		* (meaning the entity that is performing the action / creating the
		* entity that costs), 'side' (meaning the side of the agent that
		* is performing the action / creating the entity that costs),
		* 'object' (meaning the action that is to be performed or the
		* entity that is to be created) or a string that specifies the code
		* to be run in order to evaluate this target.
		*
		* @type {String}
		*/
		this.target = target;

		/**
		* the array of conditions that must be met after processing the
		* cost (i.e. once the new value of the property would be in place)
		* in order for the cost to be fulfillable. For instance, the
		* default condition, which is used if the user ignores this
		* argument when calling the constructor or when
		* <cost basic="true">...</cost> is used as the XML rule for the
		* cost instead of <cost>...</cost>, is that the minimum value of
		* the property to be altered will be zero after the cost is
		* deducted from it. Note that all conditions must test for the
		* property's putative value, not its current value, because the
		* tests occur before its value is actually changed.
		*
		* @type {Array.<Faith.Encounter.Condition>}
		*/
		if (this.conds !== null) {
			this.conds = conditions;
		} else {
			//[TODO]
		

		}
	}
}
export default Cost;
