const assert = require('chai').assert;
import { ParserError } from '~/src/encounter/parser.js';
import { _VisTopLevel } from '~/src/encounter/ruleset2.js'; 

let xmlEncounterId = 'id="encounter-default"\n'
let xmlEncounterIdDifferent = 'id="encounter-different"\n';
let xmlEncounterClasses =
	'class="enc-class-1,  enc-class-2,  enc-class-3  "\n';
let arrayEncounterClasses =
	['enc-class-1', 'enc-class-2', 'enc-class-3'];
let xmlEncounterClassesDifferent =
	'class="enc-class-100, enc-class-3"\n'
let arrayEncounterClassesDifferent = 
	['enc-class-100', 'enc-class-3'];


let xmlPropertyId = 'id="property-id"\n';
let xmlPropertyIdDifferent = 'id="property-id-different"\n';
let xmlPropertyClasses =
	'class="prop-class-1,prop-class-2,prop-class-3"\n';
let arrayPropertyClasses = 
	['prop-class-1', 'prop-class-2', 'prop-class-3'];
let xmlPropertyClassesDifferent =
	'class="prop-class-100,prop-class-2"\n';
let arrayPropertyClassesDifferent = 
	['prop-class-100', 'prop-class-2'];

let xmlModeReplace = 'mode="replace"\n';
let xmlModeAlter = 'mode="alter"\n';
let xmlModeDelete = 'mode="delete"\n';

// these are the default encounter attributes
let xmlEncounterAttributesDefault = 
	'properties="false"\n'
	+ 'propertiesRefresh="false"\n'
	+ 'traits="true"\n'
	+ 'traitsRefresh="false"\n'
	+ 'secrets="false"\n'
	+ 'secretsRefresh="false"\n'
	+ '>\n';

// the first three of these attributes are the opposite of the
// default encounter attributes, the others are the defaults
let xmlEncounterAttributesPartiallySwapped =
	'properties="true"\n'
	+ 'propertiesRefresh="true"\n'
	+ 'traits="false"\n'
	+ 'traitsRefresh="false"\n'
	+ 'secrets="false"\n'
	+ 'secretsRefresh="false"\n'
	+ '>\n';

// only the first three attributes exist, and these are the
// opposite of the default attributes
let xmlEncounterAttributesLimitedSwapped =
	'properties="true"\n'
	+ 'propertiesRefresh="true"\n'
	+ 'traits="false"\n'
	+ '>\n';

// these are the complete opposite of the default encounter attributes
let xmlEncounterAttributesSwapped = 
	'properties="true"\n'
	+ 'propertiesRefresh="true"\n'
	+ 'traits="false"\n'
	+ 'traitsRefresh="true"\n'
	+ 'secrets="true"\n'
	+ 'secretsRefresh="true"\n'
	+ '>\n';

let xmlProperty1 = 
	'vis="false"\n'
	+ 'refresh="false"\n'
	+ '></property>\n';

// the property has vis="true", refresh="true"
let xmlProperty2 = 
	'vis="true"\n'
	+ 'refresh="true"\n'
	+ '></property>\n';

// the property has has vis="true", refresh="false"
let xmlProperty3 = 
	'vis="true"\n'
	+ 'refresh="false"\n'
	+ '></property>\n';

// only has refresh="false"
let xmlPropertyPartial1 =
	'refresh="false"\n'
	+ '></property>\n';

// only has refresh="true"
let xmlPropertyPartial2 =
	'refresh="true"\n'
	+ '></property>\n';

let xmlFullEncounter =
	xmlEncounterId
	+ xmlEncounterClasses
	+ xmlEncounterAttributesSwapped
	+ '<property\n'
	+ xmlPropertyId
	+ xmlPropertyClasses
	+ xmlProperty1
	+ '<property\n'
	+ xmlProperty2;

// verify that the attributes of the rule are equal to the defaults
function verifyAttributesDefault(rule) {
	assert.isFalse(rule.properties);
	assert.isFalse(rule.propertiesRefresh);
	assert.isTrue(rule.traits);
	assert.isFalse(rule.traitsRefresh);
	assert.isFalse(rule.secrets);
	assert.isFalse(rule.secretsRefresh);
}

// verify that the first three attributes of the rule are the opposite
// of the defaults, while the others have been unchanged
function verifyAttributesPartiallySwapped(rule) {
	assert.isTrue(rule.properties);
	assert.isTrue(rule.propertiesRefresh);
	assert.isFalse(rule.traits);
	assert.isFalse(rule.traitsRefresh);
	assert.isFalse(rule.secrets);
	assert.isFalse(rule.secretsRefresh);
}

// verify that the attributes of the rule are the complete oppposite
// of the defaults
function verifyAttributesSwapped(rule) {
	assert.isTrue(rule.properties);
	assert.isTrue(rule.propertiesRefresh);
	assert.isFalse(rule.traits);
	assert.isTrue(rule.traitsRefresh);
	assert.isTrue(rule.secrets);
	assert.isTrue(rule.secretsRefresh);
}

// creates an array from a set
function arrayFromSet(set) {
	let array = [];
	for (let entry of set.values()) {
		array.push(entry);
	}
	return array;
}

// verifies that there is one encounter rule loaded and its attributes
// are the defaults
function verifyOneDefaultEncounterRule(xmlString) {
	this.ruleset.parse(xmlString);

	// There are no rules besides the default rule
	assert.lengthOf(this.ruleset.vis.encounter, 1);

	let rule = this.ruleset.vis.encounter[0];
	let dflt = new _VisTopLevel().encounter[0];
		// (default rule)

	// the visibility rule in the ruleset will equal the default
	for (let attr of Object.keys(rule)) {
		assert.deepEqual(rule[attr], dflt[attr])
	}
};

// verifies that the full encounter rule has been correctly loaded
// and its attributes are the opposite of the defaults
function verifyFullEncounterRuleLoaded(xmlString) {
	this.ruleset.parse(xmlString);

	assert.lengthOf(this.ruleset.vis.encounter, 2);

	let rule = this.ruleset.vis.encounter[1];

	assert.sameMembers(arrayFromSet(rule.classes),
		['enc-class-1', 'enc-class-2', 'enc-class-3']);

	assert.equal(rule.id, 'encounter-default');
	verifyAttributesSwapped(rule);

	assert.lengthOf(rule.propList, 2);

	let prop = rule.propList[0];
	assert.equal(prop.id, 'property-id');
	assert.sameMembers(arrayFromSet(prop.classes),
		['prop-class-1', 'prop-class-2', 'prop-class-3']);
	assert.isFalse(prop.vis);
	assert.isFalse(prop.refresh);

	prop = rule.propList[1];
	assert.isNull(prop.id);
	assert.equal(prop.classes.size, 0);
	assert.isTrue(prop.vis);
	assert.isTrue(prop.refresh);
}


	//***** Throws an error *****
function casesThrows() {
	it('throws when the top-level rule does not have a valid tag',
			function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<shouldThrow>\n'
			+ '</shouldThrow>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		assert.throws(fn.bind(this), ParserError);

	});

	it('throws when a top-level encounter rule has an invalid '
			+ 'attribute', function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ 'shouldThrow="throw"'
			+ '>\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		assert.throws(fn.bind(this), ParserError);
	});

	it('throws when a top-level encounter rule has an invalid '
			+ 'child element', function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter>\n'
			+ '<shouldThrow>\n'
			+ '</shouldThrow>\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		assert.throws(fn.bind(this), ParserError);
	});

	it('throws when a property rule has an invalid attribute',
			function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter>\n'
			+ '<property\n'
			+ 'shouldThrow="throw"\n'
			+ '>\n'
			+ '</property>\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		assert.throws(fn.bind(this), ParserError);
	});

	it('throws when a property rule has a child element node',
			function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter>\n'
			+ '<property>\n'
			+ '<shouldThrow>\n'
			+ '</shouldThrow>\n'
			+ '</property>\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		function fn() {
			this.ruleset.parse(xmlString);
		}
		assert.throws(fn.bind(this), ParserError);
	});
}

	// ***** Loads basic rules *****
function casesLoadsBasic() {
	it('enables allVisible when the rule is set', function() {
		let xmlString = 
			'<ruleset>\n'
			+ '<visibility allVisible="true">\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isTrue(this.ruleset.allVisible);
	});


	it('does not enable allVisible when the rule is not set',
			function() {
		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isFalse(this.ruleset.allVisible);
	});

	it('disables allVisible when a new rule overrides it', function() {
		let xmlString = 
			'<ruleset>\n'
			+ '<visibility allVisible="true">\n'
			+ '</visibility>\n'
			+ '<visibility allVisible="false">\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isFalse(this.ruleset.allVisible);
	});

	it('does not disable allVisible when a new rule does not override it',
			function() {
		let xmlString = 
			'<ruleset>\n'
			+ '<visibility allVisible="true">\n'
			+ '</visibility>\n'
			+ '<visibility>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isTrue(this.ruleset.allVisible);
	});

	it('enables overrideDefaultProbing when the rule is set', function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility overrideDefaultProbing="true">\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isTrue(this.ruleset.overrideDefaultProbing);

	});

	it('does not enable overrideDefaultProbing when the rule is not set',
			function () {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isFalse(this.ruleset.overrideDefaultProbing);
	});

	it('disables overrideDefaultProbing when a new rule overrides it',
			function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility overrideDefaultProbing="true">\n'
			+ '</visibility>\n'
			+ '<visibility overrideDefaultProbing="false">\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isFalse(this.ruleset.overrideDefaultProbing);

	});

	it('does not disable overrideDefaultProbing when a new rule does not '
			+ 'override it', function() {
		let xmlString = 
			'<ruleset>\n'
			+ '<visibility overrideDefaultProbing="true">\n'
			+ '</visibility>\n'
			+ '<visibility>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'

		this.ruleset.parse(xmlString);

		assert.isTrue(this.ruleset.overrideDefaultProbing);
	});
}

	// ***** Loads empty top-level encounter *****
function casesLoadsTopLevel() {
	it('loads an empty top-level encounter rule, inherited mode="replace"',
			function() {
		// 'inherited' meaning the rule has no mode, but inherits it
		// from a previous rule

		let xmlString = 
			'<ruleset mode="delete">\n'
			+ '<visibility mode="replace">\n'
			+ '<encounter>\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});
	it('loads an empty top-level encounter rule, inherited mode="alter"',
			function() {
		// 'inherited' meaning the rule has no mode, but inherits it
		// from a previous rule
		
		let xmlString = 
			'<ruleset mode="delete">\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter>\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});

	it('loads an empty top-level encounter rule, inherited mode="delete"',
			function() {
		// 'inherited' meaning the rule has no mode, but inherits it
		// from a previous rule

		let xmlString = 
			'<ruleset mode="alter">\n'
			+ '<visibility mode="delete">\n'
			+ '<encounter>\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});

	it('loads an empty top-level encounter rule, own mode="replace"',
			function() {
		// 'own' means that the rule has the specified mode

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="replace">\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});

	it('loads an empty top-level encounter rule, own mode="alter"',
			function() {
		// 'own' means that the rule has the specified mode

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility mode="replace">\n'
			+ '<encounter mode="alter">\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});

	it('loads an empty top-level encounter rule, own mode="delete"',
			function() {
		// 'own' means that the rule has the specified mode

		let xmlString =
			'<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="delete">\n'
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});

	//***** Loads full top-level encounter *****

	it('loads a full top-level encounter rule, inherited mode="replace"',
			function() {
		// 'inherited' meaning the rule has no mode, but inherits it
		// from a previous rule

		let xmlString = 
			'<ruleset mode="delete">\n'
			+ '<visibility mode="replace">\n'
			+ '<encounter\n'
			+ xmlFullEncounter
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyFullEncounterRuleLoaded.bind(this)(xmlString);
	});

	it('loads a full top-level encounter rule, inherited mode="alter"',
			function() {
		// 'inherited' meaning the rule has no mode, but inherits it
		// from a previous rule

		let xmlString = 
			'<ruleset mode="delete">\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter\n'
			+ xmlFullEncounter
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyFullEncounterRuleLoaded.bind(this)(xmlString);
	});

	it('does not load a full top-level encounter rule, inherited '
			+ 'mode="delete"', function() {
		// 'inherited' meaning the rule has no mode, but inherits it
		// from a previous rule

		let xmlString = 
			'<ruleset mode="alter">\n'
			+ '<visibility mode="delete">\n'
			+ '<encounter\n'
			+ xmlFullEncounter
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});

	it('loads a full top-level encounter rule, own mode="replace"',
			function() {
		// 'own' means that the rule has the specified mode

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="replace"\n'
			+ xmlFullEncounter
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyFullEncounterRuleLoaded.bind(this)(xmlString);
	});

	it('loads a full top-level encounter rule, own mode="alter"',
			function() {
		// 'own' means that the rule has the specified mode

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility mode="replace">\n'
			+ '<encounter mode="alter"\n'
			+ xmlFullEncounter
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyFullEncounterRuleLoaded.bind(this)(xmlString);
	});

	it('does not load a full top-level encounter rule, own mode="delete"',
			function() {
		// 'own' means that the rule has the specified mode

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="delete"\n'
			+ xmlFullEncounter
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		verifyOneDefaultEncounterRule.bind(this)(xmlString);
	});
}

	//***** Replaces top-level encounter *****
function casesModsTopLevel() {
	it('replaces a top-level encounter rule, no id / class',
			function() {
		// 'no id / class' means the <encounter> rules have no id or class

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 1);

		let rule = this.ruleset.vis.encounter[0];
		verifyAttributesSwapped(rule);
	});

	it('replaces a top-level encounter rule, same id',
			function() {
		// 'same id' means the two encounter rules have the same id

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesSwapped(rule);
	});

	it('replaces a top-level encounter rule, same classes',
			function() {
		// 'same classes' means the two encounter rules have the same
		// classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesSwapped(rule);
	});

	it('does not replace a top-level encounter rule, different ids',
			function() {
		// 'different ids' means the two encounter rules have different ids

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ xmlEncounterClasses
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterIdDifferent
			+ xmlEncounterClasses
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 3);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesDefault(rule);
		rule = this.ruleset.vis.encounter[2];
		verifyAttributesSwapped(rule);
	});

	it('does not replace a top-level encounter rule, different classes',
			function() {
		// 'different classes' means the two encounter rules have
		// different classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClassesDifferent
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 3);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesDefault(rule);
		assert.sameMembers
			(arrayFromSet(rule.classes), arrayEncounterClasses)

		rule = this.ruleset.vis.encounter[2];
		verifyAttributesSwapped(rule);
		assert.sameMembers
			(arrayFromSet(rule.classes), arrayEncounterClassesDifferent)
	});

	//***** Alters top-level encounter *****
	it('alters a top-level encounter rule, no id / class', function() {
		// 'no id / class' means the <encounter> rules have no id or class

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterAttributesPartiallySwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 1);

		let rule = this.ruleset.vis.encounter[0];
		verifyAttributesPartiallySwapped(rule);
	});

	it('alters a top-level encounter rule, same id', function() {
		// 'same id' means the two encounter rules have the same id

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesPartiallySwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesPartiallySwapped(rule);
	});

	it('alters a top-level encounter rule, same classes', function() {
		// 'same classes' means the two encounter rules have the same
		// classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesPartiallySwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesPartiallySwapped(rule);
		assert.sameMembers
			(arrayFromSet(rule.classes), arrayEncounterClasses)
	});

	it('does not alter a top-level encounter rule, different ids',
			function() {
		// 'different ids' means the two encounter rules have different ids

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ xmlEncounterClasses
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterIdDifferent
			+ xmlEncounterClasses
			+ xmlEncounterAttributesPartiallySwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 3);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesDefault(rule);
		rule = this.ruleset.vis.encounter[2];
		verifyAttributesPartiallySwapped(rule);
	});

	it('does not alter a top-level encounter rule, different classes',
			function() {
		// 'different classes' means the two encounter rules have
		// different classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterClassesDifferent
			+ xmlEncounterAttributesPartiallySwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 3);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesDefault(rule);
		rule = this.ruleset.vis.encounter[2];
		verifyAttributesPartiallySwapped(rule);
	});

	//***** Deletes top-level encounter *****
	it('deletes a top-level encounter rule, no id / class', function() {
		// 'no id / class' means the <encounter> rules have no id or class
		
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '<encounter mode="delete"\n'
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';
	
		verifyOneDefaultEncounterRule.bind(this)(xmlString)
	});

	it('deletes a top-level encounter rule, same id', function() {
		// 'same id' means the two encounter rules have the same id

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '<encounter mode="delete"\n'
			+ xmlEncounterId
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';
	
		verifyOneDefaultEncounterRule.bind(this)(xmlString)
	});

	it('deletes a top-level encounter rule, same classes', function() {
		// 'same classes' means the two encounter rules have the same
		// classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '<encounter mode="delete"\n'
			+ xmlEncounterClasses
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';
	
		verifyOneDefaultEncounterRule.bind(this)(xmlString)
	});

	it('does not delete a top-level encounter rule, different ids',
			function() {
		// 'different ids' means the two encounter rules have different ids
		
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ xmlEncounterClasses
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '<encounter mode="delete"\n'
			+ xmlEncounterIdDifferent
			+ xmlEncounterClasses
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString)
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesSwapped(rule);
	});

	it('does not delete a top-level encounter rule, different classes',
			function() {
		// 'different classes' means the two encounter rules have
		// different classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterClasses
			+ xmlEncounterAttributesSwapped
			+ '></encounter>\n'
			+ '<encounter mode="delete"\n'
			+ xmlEncounterClassesDifferent
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString)
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		verifyAttributesSwapped(rule);
	});

	//[TODO] ruleset-to-ruleset replace, alter, delete
	//***** Affects top-level encounter in different ruleset *****
	
	it('replaces an encounter rule in a different ruleset, '
			+ 'same parse call', function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlModeReplace
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'
			+ '<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlModeReplace
			+ xmlEncounterId
			+ xmlEncounterAttributesPartiallySwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.equal(rule.id, 'encounter-default');
		verifyAttributesPartiallySwapped(rule);
	});

	it('alters an encounter rule in a different ruleset, '
			+ 'same parse call', function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'
			+ '<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter\n'
			+ xmlModeAlter
			+ xmlEncounterId
			+ xmlEncounterAttributesLimitedSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.equal(rule.id, 'encounter-default');
		verifyAttributesPartiallySwapped(rule);
	});

	it('deletes an encounter rule in a different ruleset, '
			+ 'same parse call', function() {
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'
			+ '<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter\n'
			+ xmlModeDelete
			+ xmlEncounterId
			+ xmlEncounterAttributesLimitedSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 1);

		let rule = this.ruleset.vis.encounter[0];
		assert.isNull(rule.id);
	});

	it('replaces an encounter rule in a different ruleset, '
			+ 'different parse call', function() {
		let xmlString1 =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlModeReplace
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'
		let xmlString2 = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlModeReplace
			+ xmlEncounterId
			+ xmlEncounterAttributesPartiallySwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString1);
		this.ruleset.parse(xmlString2);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.equal(rule.id, 'encounter-default');
		verifyAttributesPartiallySwapped(rule);


	});

	it('alters an encounter rule in a different ruleset, '
			+ 'different parse call', function() {
		let xmlString1 =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'
		let xmlString2 = 
			'<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter\n'
			+ xmlModeAlter
			+ xmlEncounterId
			+ xmlEncounterAttributesLimitedSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString1);
		this.ruleset.parse(xmlString2);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.equal(rule.id, 'encounter-default');
		verifyAttributesPartiallySwapped(rule);
	})

	it('deletes an encounter rule in a different ruleset, '
		 	+ 'different parse call', function() {
		let xmlString1 =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter\n'
			+ xmlEncounterId
			+ xmlEncounterAttributesDefault
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n'
		let xmlString2 = 
			'<ruleset>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter\n'
			+ xmlModeDelete
			+ xmlEncounterId
			+ xmlEncounterAttributesLimitedSwapped
			+ '></encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString1);
		this.ruleset.parse(xmlString2);

		assert.lengthOf(this.ruleset.vis.encounter, 1);

		let rule = this.ruleset.vis.encounter[0];
		assert.isNull(rule.id);
	});
}

function casesCollapsesTopLevelEncounterProperty() {
	//***** Collapses top-level encounter's property list *****
	it('collapses a top-level encounter rule\'s property list, '
			+ 'replace / replace', function() {
		// 'replace / replace' means the second and third property rule
		// in the encounter rule will have 'mode="replace"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty3
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		assert.isTrue(rule.propList[0].vis);
		assert.isFalse(rule.propList[0].refresh);
	});

	it('collapses a top-level encounter rule\'s property list, '
			+ 'replace / alter', function() {
		// 'replace / alter' means that the second property rule in the
		// encounter rule will have 'mode="replace"' and the third one
		// will have 'mode="alter"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyId
			+ xmlPropertyPartial1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		assert.isTrue(rule.propList[0].vis);
		assert.isFalse(rule.propList[0].refresh);
	});

	it('collapses a top-level encounter rule\'s property list, '
			+ 'replace / delete', function() {
		// 'replace / delete' means that the second property rule in the
		// encounter rule will have 'mode="replace"' and the third one
		// will have 'mode="delete"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyId
			+ xmlProperty3
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 0);
	});


	it('collapses a top-level encounter rule\'s property list, '
			+ 'alter / replace', function() {
		// 'alter / replace' means that the second property rule in the
		// encounter rule will have 'mode="alter"' and the third one
		// will have 'mode="replace"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty3
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		assert.isTrue(rule.propList[0].vis);
		assert.isFalse(rule.propList[0].refresh);
	});

	it('collapses a top-level encounter rule\'s property list, '
			+ 'alter / alter', function() {
		// 'alter / alter' means the second and third property rule
		// in the encounter rule will have 'mode="alter"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyId
			+ xmlPropertyPartial1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		assert.isTrue(rule.propList[0].vis);
		assert.isFalse(rule.propList[0].refresh);
	});

	it('collapses a top-level encounter rule\'s property list, '
			+ 'alter / delete', function() {
		// 'alter / delete' means that the second property rule in the
		// encounter rule will have 'mode="alter"' and the third one
		// will have 'mode="delete"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyId
			+ xmlProperty3
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 0);
	});

	it('collapses a top-level encounter rule\'s property list, '
			+ 'delete / replace', function() {
		// 'delete / replace' means that the second property rule in the
		// encounter rule will have 'mode="delete"' and the third one
		// will have 'mode="replace"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty3
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		assert.isTrue(rule.propList[0].vis);
		assert.isFalse(rule.propList[0].refresh);
	});

	it('collapses a top-level encounter rule\'s property list, '
			+ 'delete / alter', function() {
		// 'delete / alter' means that the second property rule in the
		// encounter rule will have 'mode="delete"' and the third one
		// will have 'mode="alter"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyId
			+ xmlPropertyPartial1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		assert.isUndefined(rule.propList[0].vis);
		assert.isFalse(rule.propList[0].refresh);
	});

	it('collapses a top-level encounter rule\'s property list, '
			+ 'delete / delete', function() {
		// 'delete / delete' means the second and third property rule
		// in the encounter rule will have 'mode="delete"'

		let xmlString = 
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyId
			+ xmlProperty2
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyId
			+ xmlProperty3
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 0);

	});
}

function casesModsTopLevelEncounterProperty() {
	//***** Replaces top-level encounter's property *****
	it('replaces a top-level encounter rule\'s property, no id / class, '
			+ 'same <encounter>', function() {
		// 'no id / class' means the two properties have no id or class
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);
		
		let prop = rule.propList[0];
		assert.isTrue(prop.vis);
		assert.isTrue(prop.refresh);
	});

	it('replaces a top-level encounter rule\'s property, same id, '
			+ 'diff <encounter>', function() {
		// 'same id' means the two properties have the same id

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '</encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);
		
		let prop = rule.propList[0];
		assert.equal(prop.id, 'property-id');
		assert.isTrue(prop.vis);
		assert.isTrue(prop.refresh);

	});


	it('replaces a top-level encounter rule\'s property, same classes, '
			+ 'diff <visibility>', function() {
		// 'same classes' means the two properties have the same classes
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClasses
			+ xmlProperty1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClasses
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);
		
		let prop = rule.propList[0];
		assert.isTrue(prop.vis);
		assert.isTrue(prop.refresh);
		assert.sameMembers
			(arrayFromSet(prop.classes), arrayPropertyClasses);
	});

	it('does not replace a top-level encounter rule\'s property, '
			+ 'different id', function() {
		// 'different ids' means the two properties have different ids
		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyIdDifferent
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 2);

		let prop = rule.propList[0];
		assert.isFalse(prop.vis);
		assert.isFalse(prop.refresh);
		assert.equal(prop.id, 'property-id');

		prop = rule.propList[1];
		assert.isTrue(prop.vis);
		assert.isTrue(prop.refresh);
		assert.equal(prop.id, 'property-id-different');
	});

	it('does not replace a top-level encounter rule\'s property, '
			+ 'different class', function() {
		// 'different classes' means the two properties have different
		// classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClasses
			+ xmlProperty1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClassesDifferent
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 2);

		let prop = rule.propList[0];
		assert.isFalse(prop.vis);
		assert.isFalse(prop.refresh);
		assert.sameMembers
			(arrayFromSet(prop.classes), arrayPropertyClasses);

		prop = rule.propList[1];
		assert.isTrue(prop.vis);
		assert.isTrue(prop.refresh);
		assert.sameMembers
			(arrayFromSet(prop.classes), arrayPropertyClassesDifferent);

	});

	//***** Alters top-level encounter's property *****
	it('alters a top-level encounter rule\'s property, no id / class, '
			+ 'diff <visibility>', function() {
		// 'no id / class' means the two properties have no id or class
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlProperty1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyPartial2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		let prop = rule.propList[0];
		assert.isNull(prop.id);
		assert.equal(prop.classes.size, 0);
		assert.isFalse(prop.vis);
		assert.isTrue(prop.refresh);
	});

	it('alters a top-level encounter rule\'s property, same id, '
			+ 'same <encounter>', function() {
		// 'same id' means the two properties have the same id
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyId
			+ xmlPropertyPartial2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		let prop = rule.propList[0];
		assert.equal(prop.id, 'property-id');
		assert.equal(prop.classes.size, 0);
		assert.isFalse(prop.vis);
		assert.isTrue(prop.refresh);
	});

	it('alters a top-level encounter rule\'s property, same classes, '
			+ 'diff <encounter>', function () {
		// 'same classes' means the two properties have the same classes
		// 'diff <encounter>' means the two properties are in different
		// <encounter> elements within the same <visibility> element

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClasses
			+ xmlProperty1
			+ '</encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyClasses
			+ xmlPropertyPartial2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		let prop = rule.propList[0];
		assert.isNull(prop.id);
		assert.sameMembers
			(arrayFromSet(prop.classes), arrayPropertyClasses);
		assert.isFalse(prop.vis);
		assert.isTrue(prop.refresh);

	});

	it('does not alter a top-level encounter rule\'s property, '
			+ 'different id', function () {
		// 'different ids' means the two properties have different ids

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '</encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyIdDifferent
			+ xmlPropertyPartial2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 2);

		let prop = rule.propList[0];
		assert.equal(prop.id, 'property-id');
		assert.equal(prop.classes.size, 0);
		assert.isFalse(prop.vis);
		assert.isFalse(prop.refresh);

		prop = rule.propList[1];
		assert.equal(prop.id, 'property-id-different');
		assert.equal(prop.classes.size, 0);
		assert.isUndefined(prop.vis);
		assert.isTrue(prop.refresh);
	});

	it('does not alter a top-level encounter rule\'s property, '
			+ 'different class', function () {
		// 'different classes' means the two properties have different
		// classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClasses
			+ xmlProperty1
			+ '</encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyClassesDifferent
			+ xmlPropertyPartial2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 2);

		let prop = rule.propList[0];
		assert.isNull(prop.id);
		assert.sameMembers
			(arrayFromSet(prop.classes), arrayPropertyClasses);
		assert.isFalse(prop.vis);
		assert.isFalse(prop.refresh);

		prop = rule.propList[1];
		assert.isNull(prop.id);
			(arrayFromSet(prop.classes), arrayPropertyClassesDifferent);
		assert.isUndefined(prop.vis);
		assert.isTrue(prop.refresh);
	});

	//***** Deletes top-level encounter's property
	it('deletes a top-level encounter rule\'s property, no id / class, '
			+ 'diff <encounter>', function() {
		// 'no id / class' means the two properties have no id or class
		// 'diff <encounter>' 

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlProperty1
			+ '</encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeDelete
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 0);
	});

	it('deletes a top-level encounter rule\'s property, same id, '
			+ 'diff <visibility>', function() {
		// 'same id' means the two properties have the same id
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '<visibility mode="alter">\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyId
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 0);
	});

	it('deletes a top-level encounter rule\'s property, same classes, '
			+ 'same <encounter>', function() {
		// 'same classes' means the two properties have the same classes
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClasses
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyClasses
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 0);
	});

	it('does not delete a top-level encounter rule\'s property, '
			+ 'different id', function () {
		// 'different ids' means the two properties have different ids

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyId
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyIdDifferent
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		let prop = rule.propList[0];
		assert.equal(prop.id, 'property-id');
		assert.equal(prop.classes.size, 0);
		assert.isFalse(prop.vis);
		assert.isFalse(prop.refresh);
	});

	it('does not delete a top-level encounter rule\'s property, '
			+ 'different class', function() {
		// 'different classes' means the two properties have different
		// classes

		let xmlString =
			'<ruleset>\n'
			+ '<visibility>\n'
			+ '<encounter mode="replace"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyClasses
			+ xmlProperty1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyClassesDifferent
			+ xmlProperty2
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 1);

		let prop = rule.propList[0];
		assert.isNull(prop.id);
		assert.sameMembers
			(arrayFromSet(prop.classes), arrayPropertyClasses);
		assert.isFalse(prop.vis);
		assert.isFalse(prop.refresh);
	});
}

function casesLoadsKindEncounter() {
	//***** Loads kind-specific encounter *****
	// not doing inherited / own modes for these as the top-level rule
	// tests already cover that
	//[TODO]
	it('loads an empty kind-specific encounter rule, mode="replace"');

	it('loads an empty kind-specific encounter rule, mode="alter"');

	it('does not load an empty kind-specific encounter rule, '
		+'mode="delete"');

	it('loads a full top-level encounter rule, mode="replace"');

	it('loads a full top-level encounter rule, mode="alter"');

	it('does not load a full top-level encounter rule, mode="delete"');
}

function casesModsKindEncounter() {
	//***** Replaces kind-specific encounter *****
	it('replaces a kind-specific encounter rule, no id / class');
		// 'no id / class' means the <encounter> rules have no id or class

	it('replaces a kind-specific encounter rule, same id');
		// 'same id' means the two encounter rules have the same id

	it('replaces a kind-specific encounter rule, same classes');
		// 'same classes' means the two encounter rules have the same
		// classes

	it('does not replace a kind-specific encounter rule, different ids');
		// 'different ids' means the two encounter rules have different ids

	it('does not replace a kind-specific encounter rule, different '
		+ 'classes');
		// 'different classes' means the two encounter rules have
		// different classes

	//***** Alters kind-specific encounter *****
	it('alters a kind-specific encounter rule, no id / class');
		// 'no id / class' means the <encounter> rules have no id or class

	it('alters a kind-specific encounter rule, same id');
		// 'same id' means the two encounter rules have the same id

	it('alters a kind-specific encounter rule, same classes');
		// 'same classes' means the two encounter rules have the same
		// classes

	it('does not alter a kind-specific encounter rule, different ids');
		// 'different ids' means the two encounter rules have different ids

	it('does not alter a kind-specific encounter rule, different classes');
		// 'different classes' means the two encounter rules have
		// different classes

	//***** Deletes kind-specific encounter *****
	it('deletes a kind-specific encounter rule, no id / class');
		// 'no id / class' means the <encounter> rules have no id or class

	it('deletes a kind-specific encounter rule, same id');
		// 'same id' means the two encounter rules have the same id

	it('deletes a kind-specific encounter rule, same classes');
		// 'same classes' means the two encounter rules have the same
		// classes

	it('does not delete a kind-specific encounter rule, different ids');
		// 'different ids' means the two encounter rules have different ids

	it('does not delete a kind-specific encounter rule, different classes');
		// 'different classes' means the two encounter rules have
		// different classes
}

function casesModsKindEncounterProperty() {
	//***** Replaces kind-specific encounter's property *****
	it('replaces a kind-specific encounter rule\'s property, '
		+ 'no id / class, same <encounter>');
		// 'no id / class' means the two properties have no id or class
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

	it('replaces a kind-specific encounter rule\'s property, '
		+ 'same id, diff <encounter>');
		// 'same id' means the two properties have the same id
		// 'diff <encounter>' means the two properties are in different
		// <encounter> elements within the same <visibility> element

	it('replaces a kind-specific encounter rule\'s property, '
		+ 'same classes, diff <visibility>');
		// 'same classes' means the two properties have the same classes
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

	it('does not replace a kind-specific encounter rule\'s property, '
		+ 'different id')
		// 'different ids' means the two properties have different ids

	it('does not replace a kind-specific encounter rule\'s property, '
		+ 'different class')
		// 'different classes' means the two properties have different
		// classes

	//***** Alters kind-specific encounter's property *****
	it('alters a kind-specific encounter rule\'s property, '
		+ 'no id / class, same <encounter>');
		// 'no id / class' means the two properties have no id or class
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

	it('alters a kind-specific encounter rule\'s property, '
		+ 'same id, diff <encounter>');
		// 'same id' means the two properties have the same id
		// 'diff <encounter>' means the two properties are in different
		// <encounter> elements within the same <visibility> element

	it('alters a kind-specific encounter rule\'s property, '
		+ 'same classes, diff <visibility>');
		// 'same classes' means the two properties have the same classes
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

	it('does not alter a kind-specific encounter rule\'s property, '
		+ 'different id')
		// 'different ids' means the two properties have different ids

	it('does not alter a kind-specific encounter rule\'s property, '
		+ 'different class')
		// 'different classes' means the two properties have different
		// classes

	//***** Deletes kind-specific encounter's property *****
	it('deletes a kind-specific encounter rule\'s property, '
		+ 'no id / class, same <encounter>');
		// 'no id / class' means the two properties have no id or class
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

	it('deletes a kind-specific encounter rule\'s property, '
		+ 'same id, diff <encounter>');
		// 'same id' means the two properties have the same id
		// 'diff <encounter>' means the two properties are in different
		// <encounter> elements within the same <visibility> element

	it('deletes a kind-specific encounter rule\'s property, '
		+ 'same classes, diff <visibility>');
		// 'same classes' means the two properties have the same classes
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

	it('does not delete a kind-specific encounter rule\'s property, '
		+ 'different id')
		// 'different ids' means the two properties have different ids

	it('does not delete a kind-specific encounter rule\'s property, '
		+ 'different class')
		// 'different classes' means the two properties have different
		// classes
}

function casesLoadsOtherRule() {
	//***** Loads action *****
	it('loads an empty kind-specific action rule');
	it('loads a full kind-specific action rule');

	//***** Loads argument *****
	it('loads an empty top-level argument rule');
	it('loads a full top-level argument rule');
	it('loads an empty kind-specific argument rule');
	it('loads a full kind-specific argument rule');

	//***** Loads booster *****
	it('loads an empty top-level booster rule');
	it('loads a full top-level booster rule');
	it('loads an empty kind-specific booster rule');
	it('loads a full kind-specific booster rule');

	//***** Loads character *****
	it('loads an empty top-level character rule');
	it('loads a full top-level character rule');
	it('loads an empty kind-specific character rule');
	it('loads a full kind-specific character rule');

	//***** Loads item *****
	it('loads an empty top-level item rule');
	it('loads a full top-level item rule');
	it('loads an empty kind-specific item rule');
	it('loads a full kind-specific item rule');

	//***** Loads trait *****
	it('loads an empty top-level trait rule');
	it('loads a full top-level trait rule');
	it('loads an empty kind-specific trait rule');
	it('loads a full kind-specific trait rule');

	//***** Loads property *****
	it('loads an empty top-level property rule');
	it('loads a full top-level property rule');
}

function casesModsProperty() {
	//***** Replaces a top-level property rule *****
	//[TODO]

}

//[TODO] test for validate()



export default function visibilityRules() {
	describe('throws an error', casesThrows);
	describe('loads basic rules', casesLoadsBasic);
	describe('loads a top-level encounter rule', casesLoadsTopLevel);
	describe('affects a top-level encounter rule', casesModsTopLevel);
	describe('collapses a top-level encounter rule\'s properties',
		casesCollapsesTopLevelEncounterProperty);
	describe('affects a top-level encounter rule\'s properties',
		casesModsTopLevelEncounterProperty);
	describe('loads a kind-specific encounter rule',
		casesLoadsKindEncounter);
	describe('affects a kind-specific encounter rule',
		casesModsKindEncounter);
	describe('loads other kinds of rules', casesLoadsOtherRule);

}

