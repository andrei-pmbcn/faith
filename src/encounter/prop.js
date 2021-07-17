/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/


import { Entity, EntityKind, targetMixin } from './entity.js';

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
		* and (if `this.kind.tethered` is set to `true`) the unmodified value
		* of the property before its sources and coeff are applied.
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
		* to obtain the initial and (if `this.kind.tethered` is set to `true`)
		* the unmodified current value of the property.
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
		* A temporary value used for checking whether the property's current
		* value meets its holder entity's creation costs.
		*
		* @type {Number}
		* @default null
		*/
		this.temp = null;

		/**
		* A temporary value used for checking whether the property's minimum
		* value meets its holder's creation costs.
		*
		* @type {Number}
		* @default null
		*/
		this.tempMin = null;

		/**
		* A temporary value used for checking whether the property's maximum
		* value meets its holder's creation costs.
		*
		* @type {Number}
		* @default null
		*/
		this.tempMax = null;

		/**
		* The sources of the current value, i.e. the properties that affect
		* this property's unmodified value. Only contains elements if
		* `this.kind.val.tethered` is `true`.
		* 
		* @type {Faith.Encounter.List}
		*/
		this.sources = new List();

		/**
		* The sources of the minimum value, i.e. the properties that affect
		* this property's unmodified minimum value. Only contains elements if
		* `this.kind.min.tethered` is `true`.
		* 
		* @type {Faith.Encounter.List}
		*/
		this.sourcesMin = new List();

		/**
		* The sources of the maximum value, i.e. the properties that affect
		* this property's unmodified maximum value. Only contains elements if
		* `this.kind.max.tethered` is `true`.
		* 
		* @type {Faith.Encounter.List}
		*/
		this.sourcesMax = new List();

		// catalog the sources
		this._catalogAllSources();

		/**
		* The effects that alter the current value. Only contains elements if
		* `this.kind.val.tethered` is `true`.
		*
		* @type {Faith.Encounter.List}
		*/
		this.effects = new List();

		/**
		* The effects that alter the minimum value. Only contains elements if
		* `this.kind.min.tethered` is `true`.
		*
		* @type {Faith.Encounter.List}
		*/
		this.effectsMin = new List();

		/**
		* The effects that alter the maximum value. Only contains elements if
		* `this.kind.max.tethered` is `true`.
		*
		* @type {Faith.Encounter.List}
		*/
		this.effectsMax = new List();

		//gather effects
		//[TODO]
		/**
		* The dependents of the current value, i.e. the properties that
		* are affected by this property's current value.
		*
		* @type {Faith.Encounter.List}
		*/
		this.dependents = new List();

		/**
		* The dependents of the minimum value, i.e. the properties that
		* are affected by this property's minimum value.
		*
		* @type {Faith.Encounter.List}
		*/
		this.dependentsMin = new List();

		/**
		* The dependents of the maximum value, i.e. the properties that
		* are affected by this property's maximum value.
		*
		* @type {Faith.Encounter.List}
		*/
		this.dependentsMax = new List();

		/**
		* The order in which the current, minimum and maximum value of this
		* property are updated, e.g. ['max', 'min', 'val']. The first
		* element of this array is updated first.
		*
		* @private
		* @type {Array}
		*/
		this.order = null;

		// Determine the update order; always update val last, so as to
		// ensure it fits within the new minimum and maximum
		if (this.base === 'min') {
			if (this.baseMin === 'max') {
				this._order = ['max', 'min', 'val'];
			} else if (this.baseMax === 'min') {
				this._order = ['min', 'max', 'val']; 
			} else {
				this._order = ['min', 'max', 'val'];
			}
		} else if (this.base === 'max') {
			if (this.baseMin === 'max') {
				this._order = ['max', 'min', 'val'];
			} else if (this.baseMax === 'min') {
				this._order = ['min', 'max', 'val'];
			} else {

			}
		} else {
			this._order = ['max', 'min', 'val'];
		}

		// Setup the initial values
		for (let category of this._order) {
			this._computeUnmod(category);
		}



		//[TODO]
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
	* Compute the property's specified unmodified value, i.e. before effects
	* modify it.
	*
	* @private
	* @param {String} category - either 'val', 'min' or 'max'; 'val' is for the
	* current value.
	*/
	_computeUnmod(category) {
		if (category === 'val') {
			if (this.base !== 'min' && this.base !== 'max') {
				this.unmod = this.base
					+ this.coeff * this.processSources('val');
			} else if (this.base === 'min') {
				this.unmod = this.unmodMin;
			} else if (this.base === 'max') {
				this.unmod = this.unmodMax;
			}
		} else if (category === 'min') {
			if (this.baseMin !== 'max') {	
				this.unmodMin = this.minBase
					+ this.minCoeff * this.processSources('min');
			} else {
				this.unmodMin = this.unmodMax;
			}
		} else if (category === 'max') {
			if (this.baseMax !== 'min') {
				this.unmodMax = this.maxBase
					+ this.maxCoeff * this.processSources('max');
			} else {
				this.unmodMax = this.unmodMin;
			}
		}
	}

	/**
	* Process the sources of the property's current, minimum or maximum value.
	*
	* @private
	* @param {String} category - either 'val', 'min' or 'max'; 'val' is for the
	* current value.
	*/
	_processSources(category) {
		//[TODO]

	}

	/**
	* Adds the property's sources to the sources, sourcesMin and sourcesMax
	* lists.
	*
	* @private
	*/
	_catalogAllSources() {
		//[TODO]



	}
}

















