/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import { Entity, EntityKind } from './entity.js';


export function parseAction(rule) {


}

export function copyAction(source, target) {


}

export class Action extends Entity {
//[TODO]
	constructor(encounter, kind, name, side, id=null, classes=[]) {
		super(encounter, kind, name, side, id, classes)

		this.targets = [];
	}

	addTarget(target) {
		//[TODO] check the action target to confirm that it
		// belongs to the category specified in its ActionKind
		this.targets.push(target);
	}

}

export class ActionKind extends EntityKind {
	constructor(id, name, classes=[]) {
		// add the 'action' class if not already present
		if (classes.indexOf('action') === -1) {
			classes.push('action');
		}
		super(id, name, classes);

	}
	//[TODO]


}

