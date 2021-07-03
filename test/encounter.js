import casesManager from './encounter/manager.js';
import casesRuleset from './encounter/ruleset.js'

export default function() {
	describe('encounter ruleset', casesRuleset);
	describe('encounter manager', casesManager);
};

