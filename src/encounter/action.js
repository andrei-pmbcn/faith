/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import Entity from './entity.js'

class Action {
	constructor(id, name, classes=[]) {
		if (classes.indexOf('action') === -1) {
			classes.push('action');
		}
		super(id, name, classes);

	}
	


}
