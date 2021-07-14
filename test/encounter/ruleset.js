import casesVisibility from './ruleset/visibility.js';
import casesEncounter from './ruleset/encounter.js';

import { Ruleset } from '~/src/encounter/ruleset.js'

const fs = require('fs');
const assert = require('chai').assert;

const casesParser = function() {
	// skipping this because xmldom issues console messages instead of
	// errors for its messages
	it.skip('throws when parsing an empty string', function() {
		let xmlString = '';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		
		assert.throws(fn.bind(this));
	});

	it('throws if ruleset contains non-rule elements',
			function() {
		//[TODO]

	});
	//[TODO] misc ruleset-related tests

	it('parses an empty ruleset', function() {
		let xmlString = '<ruleset></ruleset>';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		
		assert.doesNotThrow(fn.bind(this));
	})

	it('parses an empty ruleset alongside and inside irrelevant elements',
			function() {
		let xmlString =
			'<abcd>\n'
			+ '<efgh>\n'
			+ '</efgh>\n'
			+ '</abcd>\n'
			+ '<container1>\n'
			+ '<container2>\n'
			+ '<ruleset>\n'
			+ '</ruleset>\n'
			+ '</container2>\n'
			+ '</container1>\n'
			+ '<abcd>\n'
			+ '<efgh>\n'
			+ '</efgh>\n'
			+ '</abcd>\n';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		
		assert.doesNotThrow(fn.bind(this));
	});

		//[TODO] good for after errors:
	it('wipes a ruleset with ruleset.wipe()');

	it('wipes the ruleset when wipe="all" is set');

	it('ruleset defaults to mode="replace"')

	it('entities inherit the ruleset\'s mode="alter"')

	it('entities inherit the ruleset\'s mode="delete"')
}


const casesParseActionCost = function() {
	before(function() {
		this.xmlpre = 
			+ '<faith-encounter-rules><action>'
			+ '<id>action-test</id>'
			+ '<cost>';

		this.xmlpost = 
			+'</cost>'
			+ '<effect></effect>'
			+ '</action></faith-encounter-rules>'
	});

	it('parses the cost of an action - target is agent', function() {
		const xml = this.xmlpre
			+ '<property>test-property</property>'
			+ '<target>agent</target>'
			+ '<value>1</value>'
			+ this.xmlpost;
	//[TODO] add a proper effect

		this.ruleset.parse(xml);
		//assert(
		//assert.equal(this.ruleset.actions.get('action-test')
		//	.costs[0]._target, 'agent');
	});

	it('parses the cost of an action - target is holder', function() {
		
	});

	it('parses the cost of an action - target is side', function() {
		
	});

	it('parses the cost of an action - target is code', function() {

	});

	it('throws for the cost of an action - target is invalid', function() {


	});



}


const casesParseAction = function() {
	it('throws an error when parsing an empty action', function() {
		

	});



	describe('parse action cost', casesParseActionCost);
};







const cases = function() {
	before(function() {
		this.xml = fs.readFileSync('test/encounter/rules.xml').toString();
	});
	beforeEach(function() {
		this.ruleset = new Ruleset({ displayWarnings: false });
	});
	afterEach(function() {
		this.ruleset = null;
	});
	describe.only('parser basics', casesParser);
	//describe('parse action', casesParseAction);

	describe.only('encounter kinds', casesEncounter);


	describe.only('visibility rules', casesVisibility);
};

export default cases;
