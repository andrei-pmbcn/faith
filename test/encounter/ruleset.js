const fs = require('fs');
import Ruleset from '~/src/encounter/ruleset.js'


const casesParser = function() {
	it('raises an error if the XML ruleset contains no relevant elements',
			function() {
		

	});

}

const casesParseAction = function() {
	it('throws an error when parsing an empty action', function() {
		

	});



};



const cases = function() {
	before(function() {
		this.xml = fs.readFileSync('test/encounter/rules.xml').toString();
	});
	beforeEach(function() {
		this.ruleset = new Ruleset();
	});
	afterEach(function() {
		this.ruleset = null;
	});
	describe('parser', casesParser);
	describe('parse action', casesParseAction);

};

export default cases;
