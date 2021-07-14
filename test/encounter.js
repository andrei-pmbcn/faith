import casesManager from './encounter/manager.js';
import casesRuleset from './encounter/ruleset.js'

export default function() {
	describe('social encounter ruleset', casesRuleset);
	describe('social encounter manager', casesManager);
};

