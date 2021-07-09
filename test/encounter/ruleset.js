const fs = require('fs');
import { Ruleset } from '~/src/encounter/ruleset.js'
import assert from 'chai';

const casesParser = function() {
	it('raises an error if the XML ruleset contains irrelevant elements',
			function() {
		

	});
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
		this.ruleset = new Ruleset();
	});
	afterEach(function() {
		this.ruleset = null;
	});
	describe('parser', casesParser);
	describe('parse action', casesParseAction);

};

export default cases;
