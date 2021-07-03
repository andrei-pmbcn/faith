import fs from 'fs';

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
	before() {
		this.xml = fs.readFileSync('test/encounter/rules.xml').toString();
	}
	beforeEach() {
		this.ruleset = new Ruleset();
	}
	afterEach() {
		this.ruleset = null;
	}
	describe('parser', casesParser);
	describe('parse action', casesParseAction);

};

export default cases;
