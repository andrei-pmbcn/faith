const assert = require('chai').assert;
import { ParserError } from '~/src/encounter/parser.js';

function casesThrows() {
	it('throws when the rule has no id');

	//[TODO]
}

function casesLoads() {
	
	
	
	
	
	
}

function casesMods() {




}



export default function casesEncounter() {
	describe('throws an error', casesThrows);
	describe('loads an encounter rule', casesLoads);
	describe('modifies an encounter rule', casesMods);
	

}
