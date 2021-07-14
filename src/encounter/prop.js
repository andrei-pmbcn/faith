/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/


import { Entity, EntityKind } from './entity.js';

/*
* Computes and stores the minima, maxima, initial value etc. of a property.
* Most other entities in the Social Encounter Engine use properties to store
* their in-game attributes and all of their numerical data.
*
* @memberof Faith.Encounter
*/
class Property extends Entity {


	constructor(kind, name, side, holder, id=null, classes=null) {
		super(kind, name, side, id, classes, null);
		
		delete this.props;

		/**
		* The entity's holder, which encapsulates the entity
		*
		* @type {Faith.Encounter.Entity}
		*/
		this.holder = holder;

		/**
		* The base value of the property's current value; can be different
		* from the respective property kind's base value. This is the initial
		* and (if `this.tethered` is set to `true`) the unmodified value of
		* the property before its sources and coeff are applied.
		* 
		* In addition to a number, the base value can be set to 'min' or
		* 'max', which signifies that the initial value will equal the
		* initial minimum or maximum value.
		*
		* @type {Number|String}
		*/
		this.base = this.kind.val ? this.kind.val.base : 0;

		/**
		* The coefficient of the property's current value, which multiples
		* the processed value of the sources of the property's current value
		* to obtain the initial and (if `this.tethered` is set to `true`) the
		* unmodified current value of the property.
		*
		* @type {Number}
		*/
		this.coeff = this.kind.val ? this.kind.val.coeff : 1;

		/**
		* Same as this.base, but for the minimum value.
		*
		* @type {Number|String}
		*/
		this.minBase = this.kind.min ? this.kind.min.base : null;

		/**
		* Same as this.coeff, but for the minimum value.
		*
		* @type {Number}
		*/
		this.minCoeff = this.kind.min ? this.kind.min.coeff : null;

		/**
		* Same as this.base, but for the maximum value.
		*
		* @type {Number|String}
		*/
		this.maxBase = this.kind.max ? this.kind.max.base : null;

		/**
		* Same as this.coeff, but for the maximum value.
		*
		* @type {Number}
		*/
		this.maxCoeff = this.kind.max ? this.kind.max.coeff : null;

		/**
		* The total value of additive effects to this property. 0 by default.
		* Whenever an additive effect affects a property that has its kind's
		* `tethered` value set to `true`, it modifies the property's `add`
		* value.
		*
		* @type {Number}
		* @default 0
		*/
		this.add = 0;

		/**
		* The total value of the multiplicative effects to this property.
		* 1 by default. Whenever a multiplicative effect affects a property
		* that has its kind's `tethered` value set to `true`, it modifies the
		* property's `mult` value. 
		*
		* @type {Number}
		* @default 1
		*/
		this.mult = 1;

		/**
		* The previous value of the property.
		*
		* @type {Number}
		*/
		this.prev = null;

		/**
		* The previous minimum value of the property.
		*
		* @type {Number}
		*/
		this.prevMin = null;

		/**
		* The previous maximum value of the property.
		*
		* @type {Number}
		*/
		this.prevMax = null;

		/**
		* A temporary value used for checking whether the entity meets its
		* creation costs.
		*
		* @type {Number}
		* @default null
		*/
		this.temp = null;

		// gather sources

		/**
		* The sources of the current value.
		* 
		*/
		this.sources = 

		//[TODO]





		if (this.base === 'min') {
			if (this.baseMin === 'max') {
				computeInitMax()
				this.min = max;
			} else if (this.baseMax === 'min') {
				computeInitMax
			}
			

		} else if (this.base === 'max') {

		} else {
			computeInitVal()
		}





	}

	/**
	* The current value of the property.
	*
	* @type {Number}
	*/
	val = null;

	/**
	* The current minimum value of the property.
	*
	* @type {Number}
	*/
	min = null;

	/**
	* The current maximum value of the property.
	*
	* @type {Number}
	*/
	max = null;

	/**
	* The unmodified current value of the property.
	*
	* @type {Number}
	*/
	unmod = null

	/**
	* The unmodified minimum value of the property.
	*
	* @type {Number}
	*/
	unmodMin = null

	/**
	* The unmodified maximum value of the property.
	*
	* @type {Number}
	*/
	unmodMax = null

	/**
	* Compute the property's unmodified value, i.e. before effects modify it.
	*
	* @private
	*/
	_computeUnmodVal() {
		if (this.base !== 'min' && this.base !== 'max') {
			this.unmod = this.base + this.coeff * this.processSources('val');
		} else if (this.base )

	}

	/**
	* Compute the property's unmodified minimum value, i.e. before effects
	* modify it.
	*
	* @private
	*/
	_computeUnmodMin() {
		this.unmodMin = this.minBase
			+ this.minCoeff * this.processSources('min');
	}

	/**
	* Compute the property's unmodified maximum value, i.e. before effects
	* modify it.
	*
	* @private
	*/
	_computeUnmodMax() {
		this.unmodMax = this.maxBase
			+ this.maxCoeff * this.processSources('max');
	}






	/**
	* Process the sources of the property's current, minimum or maximum value.
	*
	* @param {String} target - either 'val', 'min' or 'max'; 'val' is for the
	* current value.
	*/
	_processSources(target) {
		//[TODO]

	}
}

















