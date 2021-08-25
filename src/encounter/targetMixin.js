/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

//[TODO][NOW] Fix all sameHolder* filters

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
	type: null,
	id: null,
	kindId: null,
	classes: null,
	notClasses: null,
	side: null,
	finished: null,
	active: null,
	alive: null,
	isTargetCode: null,
	getTargetsCode: null,
}

/**
* The methods used for getting targets that fit a specification and checking
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
		// check if the candidate has the right id
		if (targetSpec.id && targetSpec.id !== candidate.id) {
			return false;
		}

		// check if the candidate has the right side, classes and flags.
		let candidates = [candidate];
		candidates = this._filterByKind(candidates, targetSpec.kindId);
		if (!candidates.length) return false;
		candidates = this._filterBySides(candidates, sides);
		if (!candidates.length) return false;
		candidates = this._filterByClasses(candidates, targetSpec);
		if (!candidates.length) return false;
		candidates = this._filterByFlags(candidates, targetSpec);
		if (!candidates.length) return false;


		function checkKindred(className) {
			let targeterCreator = this._getEntityCreator(
				targeter, targetSpec.type);
			let candidateCreator = this._getEntityCreator(
				candidate, targetSpec.type);
			if (!targeterCreator || !candidateCreator
					|| targeterCreator !== candidateCreator)
				return false;
			
			if (candidate.constructor.name === className)
				return true;
			return false;
		}


		let creator;
		let holder;
		let candHolder;
		switch (targetSpec.type) {
			case 'encounter':
				if (candidate.constructor.name === 'Encounter')
					return true;
				return false;
			case 'side':
				if (candidate.constructor.name === 'Side')
					return true;
				return false;
			case 'self':
				if (candidate === targeter)
					return true;
				return false;
			case 'target':
				if (targeter.target) {
					if (candidate === targeter.target) {
						return true;
					}
					return false;
				} else if (targeter.targets) {
					for (let target of targeter.targets) {
						if (target === candidate) {
							return true;
						}
					}
					return false;
				} else {
					if (this.displayWarnings) {
						let errMsg = 
							"Could not find target for targetSpec.type "
							+ "= 'target', targeter kind is "
							+ targeter.kind.id + "\n";
						if (targeter.holder) {
							errMsg += "targeter holder's kind is "
							+ targeter.holder.kind.id + "\n";
						}
						console.warn(errMsg);
					}
					return false;
				}
			case 'holder':
				holder = _getEntityHolder(targeter, targetSpec.type);
				if (holder && holder === candidate) {
					return true;
				}
				return false;
			case 'holder2':
				holder = _getEntityHolder(targeter, targetSpec.type, 2);
				if (holder && holder === candidate) {
					return true;
				}
				return false;
			case 'holder3':
				holder = _getEntityHolder(targeter, targetSpec.type, 3);
				if (holder && holder === candidate) {
					return true;
				}
				return false;
			case 'ultimateHolder':
				holder = _getEntityHolder(targeter, targetSpec.type);
				if (!holder) return false;

				while (holder.holder) {
					holder = holder.holder;
				}

				if (holder === candidate) {
					return true;
				}
				return false;
			case 'creator':
				creator = this._getEntityCreator(targeter, targetSpec.type);
				if (creator && creator === candidate)
					return true;
				return false;
			case 'code':
				//[TODO]
				throw 'code not yet supported';
			case 'kindredActions':
				return checkKindred('Action');
			case 'kindredArguments':
				return checkKindred('Argument');
			case 'kindredBoosters':
				return checkKindred('Booster');
			case 'kindredCharacters':
				return checkKindred('Character');
			case 'kindredItems':
				return checkKindred('Item');
			case 'kindredTraits':
				return checkKindred('Trait');
			case 'sameHolderBoosters':
				// check that the candidate is a booster
				if (candidate.constructor.name !== 'Booster')
					return false;

				// check that the targeter's eventual holder is an argument
				holder = targeter.holder;
				while (!holder.boosters) {
					if (!holder.holder) {
						if (this.displayWarnings) {
							let errMsg = 
								"Could not find ultimate argument holder for "
								+ "targetSpec.type = 'sameHolderBoosters', "
								+ "targeter kind is "
								+ targeter.kind.id + "\n";
							if (targeter.holder) {
								errMsg += "targeter holder's kind is "
								+ targeter.holder.kind.id + "\n";
							}
							console.warn(errMsg);
						}
						return false;
					}
				}

				// check that the candidate's holder exists and matches
				// the targeter's argument holder
				if (!candidate.holder)
					return false;
				// (since the candidate is a booster, we do not need to check
				// if its holder is an argument)
				if (candidate.holder !== holder)
					return false;
				return true;
			case 'sameHolderEffects':
				return checkSameHolder('Effect');
			case 'sameHolderItems':
		function checkSameHolder(className) {
			let targeterHolder = this._getEntityHolder(
				targeter, targetSpec.type);
			let candidateHolder = this._getEntityHolder(
				candidate, targetSpec.type);
			if (!targeterHolder || !candidateHolder
					|| targeterHolder !== candidateHolder) {
				return false;
			}

			if (candidate.constructor.name === className)
				return true;
			return false;
		}

				return checkSameHolder('Item');
			case 'sameHolderEquippedItems':
				if (!checkSameHolder('Item'))
					return false;
				//[TODO]
				if (candidate.isEquipped)
					return true;
				return false;
			case 'sameHolderTraits':
				return checkSameHolder('Trait');
			case 'allDevelopers':
				holder = targeter;
				while (!holder.developers) {
					holder = holder.holder;
					if (!holder.holder) {
						if (this.displayWarnings) {
							let errMsg = 
								"Could not find developers for "
								+ "targetSpec.type "
								+ "= 'allDevelopers', targeter kind is "
								+ targeter.kind.id + "\n";
							if (targeter.holder) {
								errMsg += "targeter holder's kind is "
								+ targeter.holder.kind.id + "\n";
							}
							console.warn(errMsg);
						}
						return false;
					}
				}
				
				if (candidate.devArg && candidate.devArg === holder) {
					return true;
				}
				return false;
			case 'allActions':
				if (candidate.constructor.name === 'Action')
					return true;
				return false;
			case 'allArguments':
				if (candidate.constructor.name === 'Argument')
					return true;
				return false;
			case 'allBoosters':
				if (candidate.constructor.name === 'Booster')
					return true;
				return false;
			case 'allGlobalBoosters':
				if (candidate.constructor.name === 'Booster'
						&& candidate.holder === null) {
					return true;
				}
				return false;
			case 'allArgumentBoosters':
				if (candidate.constructor.name === 'Booster'
						&& candidate.holder !== null) {
					return true;
				}
				return false;
			case 'allFriendlyBoosters':
				if (candidate.constructor.name === 'Booster'
						&& candidate.holder !== null
						&& candidate.holder.side === candidate.side) {
					return true;
				}
				return false;
			case 'allAdverseBoosters':
				if (candidate.constructor.name === 'Booster'
						&& candidate.holder !== null
						&& candidate.holder.side !== candidate.side) {
					return true;
				}
				return false;
			case 'allCharacters':
				if (candidate.constructor.name === 'Character')
					return true;
				return false;
			case 'allEffects':
				if (candidate.constructor.name === 'Effect')
					return true;
				return false;
			case 'allItems':
				if (candidate.constructor.name === 'Item')
					return true;
				return false;
			case 'allEquippedItems':
				if (candidate.constructor.name !== 'Item')
					return false;
				//[TODO]
				if (candidate.isEquipped)
					return true;
				return false;
			case 'allTraits':
				if (candidate.constructor.name === 'Trait')
					return true;
				return false;
			case 'allArgumentTraits':
				if (candidate.constructor.name === 'Trait'
						&& candidate.holder
						&& candidate.holder.constructor.name === 'Argument') {
					return true;
				}
				return false;
			case 'allCharacterTraits':
				if (candidate.constructor.name === 'Trait'
						&& candidate.holder
						&& candidate.holder.constructor.name === 'Character') {
					return true;
				}
				return false;
			case 'allEncounterTraits':
				if (candidate.constructor.name === 'Trait'
						&& candidate.holder
						&& candidate.holder.constructor.name === 'Encounter') {
					return true;
				}
				return false;
			case 'allItemTraits':
				if (candidate.constructor.name === 'Trait'
						&& candidate.holder
						&& candidate.holder.constructor.name === 'Item') {
					return true;
				}
				return false;
			default:
				throw "Invalid targetSpec type '" + targetSpec.type
					+ "'; consult the manual for a list of valid targetSpec "
					+ "types."
		}
	},

	/**
	* Gets all the targets with the given specification
	*
	* @param {Faith.Encounter.Entity} targeter - the entity attempting the
	* targeting
	*
	* @param {Faith.Encounter.targetSpec} targetSpec - the target
	* specification to be compared against
	* 
	* @return {Array.<Faith.Encounter.Entity>} the targets found
	*/
	getTargets(targeter, targetSpec) {
		let candidates = []; // the list of entities that might be targets

		// If an id is provided, verify the sole candidate rather than
		// building a candidate list.
		if (targetSpec.id) {
			let candidate = this.manager.all.getById(targetSpec.id);
			if (candidate && this.isTarget(candidate, targeter, targetSpec)) {
				candidates.push(candidate);
			}
			return candidates;
		}

		// Get the targeted sides
		let sides = this._getCandidateSides(targeter, targetSpec);

		// Get the potentially targeted entities
		let creator;
		let holder;
		switch (targetSpec.type) {
			case 'encounter':
				candidates.push(this.manager.encounter);
				break;
			case 'side':
				if (sides === null)
					sides = [0, 1, 2];
				for (let side of sides) {
					candidates.push(this.manager.sides[side]);
				}
				break;
			case 'self':
				candidates.push(targeter);
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'target':
				if (targeter.target) {
					// targeter is an effect
					candidates.push(targeter.target);
				} else if (targeter.targets) {
					// targeter is an action
					for (let target of targeter.targets) {
						candidates.push(target);
					}
				} else {
					if (this.displayWarnings) {
						let errMsg = 
							"Could not find target for targetSpec.type "
							+ "= 'target' , targeter kind is "
							+ targeter.kind.id + "\n";
						if (targeter.holder) {
							errMsg += "targeter holder's kind is "
							+ targeter.holder.kind.id + "\n";
						}
						console.warn(errMsg);
					}
				}
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'holder':
				holder = _getEntityHolder(targeter, 'holder');
				if (holder) {
					candidates.push(targeter.holder);
					candidates = this._filterBySides(candidates, sides);
				}
				break;
			case 'holder2':
				holder = _getEntityHolder(targeter, 'holder2', 2);
				if (holder) {
					candidates.push(targeter.holder);
					candidates = this._filterBySides(candidates, sides);
				}
				break;
			case 'holder3':
				holder = _getEntityHolder(targeter, 'holder3', 3);
				if (holder) {
					candidates.push(targeter.holder);
					candidates = this._filterBySides(candidates, sides);
				}
				break;
			case 'ultimateHolder':
				holder = _getEntityHolder(targeter, 'ultimateHolder');
				if (!holder) break;

				while (holder.holder) {
					holder = holder.holder;
				}

				candidates.push(holder);
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'creator':
				creator = this._getEntityCreator(targeter, 'creator');
				if (creator) {
					candidates.push(holder.creator);
					candidates = this._filterBySides(candidates, sides);
				}
				break;
			case 'code':
				//[TODO]
				throw 'code not yet supported'
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'kindredActions':
				creator = this._getEntityCreator(
					targeter, 'kindredActions');
				if (!creator) break;
				for (let side of sides) {
					for (let action of this.manager.sides[side].actions) {
						if (action.creator === creator) {
							candidates.push(action);
						}
					}
				}
				break;
			case 'kindredArguments':
				creator = this._getEntityCreator(
					targeter, 'kindredArguments');
				if (!creator) break;
				for (let side of sides) {
					for (let argument of this.manager.sides[side].args) {
						if (argument.creator === creator) {
							candidates.push(argument);
						}
					}
				}
				break;
			case 'kindredBoosters':
				creator = this._getEntityCreator(
					targeter, 'kindredBoosters');
				if (!creator) break;
				for (let side of sides) {
					for (let booster of this.manager.sides[side].boosters) {
						if (argument.creator === creator) {
							candidates.push(booster);
						}
					}
				}
				break;
			case 'kindredCharacters':
				creator = this._getEntityCreator(
					targeter, 'kindredCharacters');
				if (!creator) break;
				for (let side of sides) {
					for (let character of this.manager.sides[side].chars) {
						if (character.creator === creator) {
							candidates.push(character);
						}
					}
				}
				break;
			case 'kindredItems':
				creator = this._getEntityCreator(
					targeter, 'kindredItems');
				if (!creator) break;
				for (let side of sides) {
					for (let item of this.manager.sides[side].items) {
						if (item.creator === creator) {
							candidates.push(item);
						}
					}
				}
				break;
			case 'sameHolderBoosters':
				holder = this._getEntityHolder(
					targeter, 'sameHolderBoosters');
				if (!holder) break;
				if (!holder.boosters) break;
				for (let booster of holder.boosters) {
					candidates.push(booster);
				}
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'sameHolderEffects':
				holder = this._getEntityHolder(
					targeter, 'sameHolderEffects');
				if (!holder) break;
				if (!holder.effects) break;
				for (let effect of holder.effects) {
					candidates.push(effect);
				}
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'sameHolderItems':
				holder = this._getEntityHolder(
					targeter, 'sameHolderItems');
				if (!holder) break;
				if (!holder.items) break;
				for (let item of holder.items) {
					candidates.push(item);
				}
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'sameHolderEquippedItems':
				holder = this._getEntityHolder(
					targeter, 'sameHolderEquippedItems');
				if (!holder) break;
				if (!holder.equippedItems) break;
				for (let equippedItem of holder.equippedItems) {
					candidates.push(equippedItem);
				}
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'sameHolderTraits':
				holder = this._getEntityHolder(
					targeter, 'sameHolderTraits');
				if (!holder) break;
				if (!holder.traits) break;
				for (let trait of holder.traits) {
					candidates.push(trait);
				}
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'allDevelopers':
				holder = targeter;
				while (!holder.developers) {
					if (!holder.holder) {
						if (this.displayWarnings) {
							let errMsg = 
								"Could not find developers for "
								+ "targetSpec.type "
								+ "= 'allDevelopers', targeter kind is "
								+ targeter.kind.id + "\n";
							if (targeter.holder) {
								errMsg += "targeter holder's kind is "
								+ targeter.holder.kind.id + "\n";
							}
							console.warn(errMsg);
						}
						break;
					}
					holder = holder.holder;
				}
				for (let developer of holder.developers) {
					candidates.push(developer);
				}
				candidates = this._filterBySides(candidates, sides);
				break;
			case 'allActions':
				for (let side of sides) {
					for (let action of this.manager.sides[side].actions) {
						candidates.push(action);
					}
				}
				break;
			case 'allArguments':
				for (let side of sides) {
					for (let argument of this.manager.sides[side].args) {
						candidates.push(argument);
					}
				}
				break;
			case 'allBoosters':
				for (let side of sides) {
					for (let booster of this.manager.sides[side].boosters) {
						candidates.push(booster);
					}
				}
				break;
			case 'allGlobalBoosters':
				for (let side of sides) {
					for (let booster of this.manager.sides[side].gBoosters) {
						candidates.push(booster);
					}
				}
				break;
			case 'allArgumentBoosters':
				for (let side of sides) {
					for (let booster of
							this.manager.sides[side].argBoosters) {
						candidates.push(booster);
					}
				}
				break;
			case 'allFriendlyBoosters':
				for (let side of sides) {
					for (let booster of
							this.manager.sides[side].friendlyBoosters) {
						candidates.push(booster);
					}
				}
				break;
			case 'allAdverseBoosters':
				for (let side of sides) {
					for (let booster of
							this.manager.sides[side].adverseBoosters) {
						candidates.push(booster);
					}
				}
				break;
			case 'allCharacters':
				for (let side of sides) {
					for (let character of
							this.manager.sides[side].chars) {
						candidates.push(character);
					}
				}
				break;
			case 'allEffects':
				for (let effect of this.manager.allEffects) {
					candidates.push(effect);
				}
				candidates = this._filterBySides(candidates);
				break;
			case 'allItems':
				for (let side of sides) {
					for (let item of
							this.manager.sides[side].items) {
						candidates.push(item);
					}
				}
				break;
			case 'allEquippedItems':
				for (let side of sides) {
					for (let equippedItem of
							this.manager.sides[side].equippedItems) {
						candidates.push(equippedItem);
					}
				}
				break;
			case 'allTraits':
				for (let traitId in this.manager.traits) {
					candidates.push(this.manager.traits[traitId]);
				}
				for (let side of sides) {
					for (let character of this.manager.sides[side].chars) {
						for (let traitId in character.traits) {
							candidates.push(character.traits[traitId]);
						}
					}
					for (let arg of this.manager.sides[side].args) {
						for (let traitId in arg.traits) {
							candidates.push(arg.traits[traitId]);
						}
					}
					for (let item of this.manager.sides[side].items) {
						for (let traitId in item.traits) {
							candidates.push(item.traits[traitId]);
						}
					}
				}
				break;
			case 'allArgumentTraits':
				for (let side of sides) {
					for (let arg of this.manager.sides[side].args) {
						for (let traitId in arg.traits) {
							candidates.push(arg.traits[traitId]);
						}
					}
				}
				break;
			case 'allCharacterTraits':
				for (let side of sides) {
					for (let character of this.manager.sides[side].chars) {
						for (let traitId in character.traits) {
							candidates.push(character.traits[traitId]);
						}
					}
				}
				break;
			case 'allEncounterTraits':
				for (let traitId in this.manager.traits) {
					candidates.push(this.manager.traits[traitId]);
				}
				break;
			case 'allItemTraits':
				for (let side of sides) {
					for (let item of this.manager.sides[side].items) {
						for (let traitId in item.traits) {
							candidates.push(item.traits[traitId]);
						}
					}
				}
			default:
				throw "Invalid targetSpec type '" + targetSpec.type
					+ "'; consult the manual for a list of valid targetSpec "
					+ "types."
		}

		//Filter by kind, classes and flags
		candidates = this._filterByKind(candidates, targetSpec.kindId);
		candidates = this._filterByClasses(candidates, targetSpec);
		candidates = this._filterByFlags(candidates, targetSpec);

		return candidates;
	},
	

	/**
	* Filters the candidates for a given target list so that only those that
	* match the classes in the targetSpec are included.
	* 
	* @private
	*
	* @param {Array.<Faith.Encounter.Entity>} candidates - the array of
	* candidates
	*
	* @param {Array.<Number>} sides - the array holding the sides that are
	* to be included
	*
	* @return {Array.<Faith.Encounter.Entity>} the filtered array of
	* candidates
	*/
	_filterByClasses(candidates, targetSpec) {
		if (!targetSpec.classes && !targetSpec.notClasses)
			return candidates;

		let filteredCandidates = [];

		candidateLoop:
		for (let candidate of candidates) {
			if (targetSpec.classes) {
				for (let cls of targetSpec.classes.values) {
					if (!candidate.classes.has(cls)) continue candidateLoop;
				}
			}

			if (targetSpec.notClasses) {
				for (let cls of targetSpec.notClasses.values) {
					if (candidate.classes.has(cls)) continue candidateLoop;
				}
			}
			
			filteredCandidates.push(candidate);
		}

		return filteredCandidates;
	}

	/**
	* Filters the candidates for a given target list so that only those whose
	* kind matches the specified entity kind are included.
	* 
	* @private
	*
	* @param {Array.<Faith.Encounter.Entity>} candidates - the array of
	* candidates
	*
	* @param {String} kindId - the filtering kind's id
	*
	* @return {Array.<Faith.Encounter.Entity>} the filtered array of
	* candidates
	*/

	_filterByKind(candidates, kindId) {
		if (!kindId)
			return candidates;
	
		filteredCandidates = [];
		for (let candidate of candidates) {
			if (candidate.kind.id === kindId) {
				filteredCandidates.push(candidate);
			}
		}
		return filteredCandidates;
	}

	/**
	* Filters the candidates for a given target list so that only those
	* whose flags match the ones in the targetSpec are included.
	*
	* @private
	* @param {Array} candidates - the array of candidates
	*
	* @param {Faith.Encounter.targetSpec} targetSpec - the targetSpec storing
	* the flags
	*
	* @return {Array.<Faith.Encounter.Entity>} the filtered array of
	* candidates
	*/
	_filterByFlags(candidates, targetSpec) {
		if ((targetSpec.finished === null
				|| targetSpec.finished === undefined)
				&& (targetSpec.active === null
				|| targetSpec.active === undefined)
				&& (targetSpec.alive === null
				|| targetSpec.alive === undefined)) {
			// (keep these as === null and === undefined because they
			// might be false, so do not use !targetSpec.active etc)
			return candidates;
		}
		let filteredCandidates = [];
		for (let candidate of candidates) {
			if (targetSpec.finished !== null
					&& targetSpec.finished !== undefined
					&& targetSpec.finished !== candidate.finished) {
				continue;
			}

			if (targetSpec.active !== null
					&& targetSpec.active !== undefined
					&& targetSpec.active !== candidate.active) {
				continue;
			}

			if (targetSpec.alive !== null
					&& targetSpec.alive !== undefined
					&& targetSpec.alive !== candidate.alive) {
				continue;
			}

			filteredCandidates.push(candidate);	
		}
		return filteredCandidates;
	},

	/**
	* Filters the candidates for a given target list so that only those
	* on the specified sides are included.
	*
	* @private
	* @param {Array.<Faith.Encounter.Entity>} candidates - the array of
	* candidates
	*
	* @param {Array.<Number>} sides - the array holding the sides that are
	* to be included
	*
	* @return {Array.<Faith.Encounter.Entity>} the filtered array of
	* candidates
	*/
	_filterBySides(candidates, sides) {
		if (sides.length === 3)
			return candidates;
		let filteredCandidates = [];
		for (let candidate of candidates) {
			if (sides.indexOf(candidate.side) !== -1) {
				filteredCandidates.push(candidate);
			}
		}
		return filteredCandidates;
	},

	/**
	* Gets the exact sides described in the targetSpec
	*
	* @param {Faith.Encounter.Entity} targeter - the entity attempting the
	* targeting
	*
	* @param {Faith.Encounter.targetSpec} targetSpec - the target
	* specification to be used
	*
	* @return {Array.<Number>} sides - the sides extracted from the targetSpec
	*/
	_getCandidateSides(targeter, targetSpec) {
		let sides = [0, 1, 2];
		let targeterSide = this._getEntitySide(targeter);
		switch (targetSpec.side) {
			case null:
			case 'all':
				break;
			case 'friendly':
				if (targetSide !== null) {
					sides = [targeterSide];
				}
				break;
			case 'opposing':
				if (targeterSide === 1) {
					sides = [2];
				} else if (targeterSide === 2) {
					sides = [1];
				} else if (targeterSide === 0) {
					sides = [1, 2];
				}
				break;
			case 'neutral':
				sides = [0];
				break;
			case 'side1':
				sides = [1];
				break;
			case 'side2':
				sides = [2];
				break;
			default:
				throw 'Invalid side attribute for targetSpec, got '
					+ targetSpec.side;
		}
		return sides;
	},


	/**
	* Gets the creator of the specified entity, raises a warning if no
	* creator is found.
	*
	* @private
	*
	* @param {Faith.Encounter.Entity} entity - the entity whose creator is to
	* be found
	*
	* @param {String} targetSpecType - the 'type' attribute of the targetSpec
	* being used in the search or matching procedure
	*
	* @return {Faith.Encounter.Entity} the creator of the entity
	*/
	_getEntityCreator(entity, targetSpecType) {
		let holder = entity;
			while (!holder.creator) {
				if (!holder.holder) {
					if (this.displayWarnings) {
						let errMsg = 
							"Could not find creator for targetSpec.type "
							+ "= '" + targetSpecType + "', created entity's "
							+ "kind is " + entity.kind.id + "\n";
						if (entity.holder) {
							errMsg += "created entity's holder's kind is "
							+ entity.holder.kind.id + "\n";
						}
						console.warn(errMsg);
					}
					return null;
				}
				holder = holder.holder;
			} 
		return holder.creator;
	}

	/**
	* Gets the holder of the specified entity, raises a warning if no holder
	* is found.
	* 
	* @private
	*
	* @param {Faith.Encounter.Entity} entity - the entity whose holder is to
	* be found
	*
	* @param {String} targetSpecType - the 'type' attribute of the targetSpec
	* being used in the search or matching procedure
	*
	* @param {Number} [order=1] - the order of the holder. If looking for the
	* entity's holder, set the order to 1 (the default). If looking for the
	* entity's holder's holder, set the order to 2, and so on.
	*
	* @return {Faith.Encounter.Entity} the holder of the entity
	*/
	_getEntityHolder(entity, targetSpecType, order=1) {
		let holder = entity;
		for (let kOrder = 1; kOrder <= order; kOrder++) {
			holder = holder.holder;
			if (!holder) {
				if (this.displayWarnings) {
					let errMsg = 
						"Could not find holder of order " + kOrder
						+ " for targetSpec.type "
						+ "= '" + targetSpecType + "' , held entity's "
						+ "kind is " + entity.kind.id + "\n";
					console.warn(errMsg);
				}
				return null;
			}
		}
		return holder;
	}

	/**
	* Gets the side of the specified entity.
	*
	* @private
	*
	* @param {Faith.Encounter.Entity} entity - the entity whose side is to
	* be found
	*
	* @return {Number} The side of the entity
	*/
	 _getEntitySide(entity) {
		// if the entity has no side, go through its hierarchy of holders
		// and see if one of them has a side
		let holder = entity;
			while (holder.side === undefined || holder.side === null) {
			holder = holder.holder;
			if (!holder) {
				return null;
			}
		}
		return holder.side;
	}
}

export { targetSpec, targetMixin }
