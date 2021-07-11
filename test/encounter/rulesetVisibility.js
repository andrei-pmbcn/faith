const assert = require('chai').assert;
import { ParserError } from '~/src/encounter/ruleset.js';
import { _VisTopLevel } from '~/src/encounter/ruleset2.js'; 

export default function visibilityRules() {
	let xmlEncounterId = 'id="encounter-default"\n'
	let xmlEncounterIdDifferent = 'id="encounter-different"\n'
	let xmlEncounterClasses = 'class="class-1,  class-2,  class-3  "\n'
	let xmlEncounterClassesDifferent = 'class="class-100, class-3"\n'
	let xmlModeReplace = 'mode="replace"\n'
	let xmlModeAlter = 'mode="alter"\n'
	let xmlModeDelete = 'mode="delete"\n'

	// these are the default encounter attributes
	let xmlEncounterAttributesDefault = 
		'properties="false"\n'
		+ 'propertiesRefresh="false"\n'
		+ 'traits="true"\n'
		+ 'traitsRefresh="false"\n'
		+ 'secrets="false"\n'
		+ 'secretsRefresh="false"\n'
		+ '>\n'

	// the first three of these attributes are the opposite of the
	// default encounter attributes, the others are the defaults
	let xmlEncounterAttributesPartiallySwapped =
		'properties="true"\n'
		+ 'propertiesRefresh="true"\n'
		+ 'traits="false"\n'
		+ 'traitsRefresh="false"\n'
		+ 'secrets="false"\n'
		+ 'secretsRefresh="false"\n'
		+ '>\n'

	// these are the complete opposite of the default encounter attributes
	let xmlEncounterAttributesSwapped = 
		'properties="true"\n'
		+ 'propertiesRefresh="true"\n'
		+ 'traits="false"\n'
		+ 'traitsRefresh="true"\n'
		+ 'secrets="true"\n'
		+ 'secretsRefresh="true"\n'
		+ '>\n'

	// the property has an id
	let xmlPropertyWithId1 = 
		'id="property-with-id"\n'
		+ 'vis="false"\n'
		+ 'refresh="false"\n'
		+ '></property>\n'

	// the property has the same id as above and has the complete opposite
	// attributes
	let xmlPropertyWithId2 = 
		'id="property-with-id"\n'
		+ 'vis="true"\n'
		+ 'refresh="true"\n'
		+ '></property>\n'

	// the property has the same id as above and has vis=true,
	// refresh=false
	let xmlPropertyWithId3 = 
		'id="property-with-id"\n'
		+ 'vis="true"\n'
		+ 'refresh="false"\n'
		+ '></property>\n'

	// the property has classes
	let xmlPropertyWithClass1 = 
		'class="pc-class-1, pc-class-2"\n'
		+ 'vis="false"\n'
		+ 'refresh="false"\n'
		+ '></property>\n'

	// the property has the same classes as above and has the complete
	// opposite attributes
	let xmlPropertyWithClass2 = 
		'class="pc-class-1, pc-class-2"\n'
		+ 'vis="true"\n'
		+ 'refresh="true"\n'
		+ '></property>\n'

	// the property has an id and classes
	let xmlPropertyWithIdClass = 
		'id="property-with-id-and-classes"\n'
		+ 'class="pic-class-1,pic-class-2,pic-class-3"\n'
		+ 'vis="false"\n'
		+ 'refresh="false"\n'
		+ '></property>\n'

	// the property has no id, no class
	let xmlPropertyNoIdNoClass1 = 
		'vis="false"\n'
		+ 'refresh="false"\n'
		+ '></property>\n'

	// the property has no id and no class as above, and has the complete
	// opposite attributes
	let xmlPropertyNoIdNoClass2 = 
		'vis="true"\n'
		+ 'refresh="true"\n'
		+ '></property>\n'

	let xmlFullEncounter =
		xmlEncounterId
		+ xmlEncounterClasses
		+ xmlEncounterAttributesSwapped
		+ '<property\n'
		+ xmlPropertyWithIdClass
		+ '<property\n'
		+ xmlPropertyNoIdNoClass1

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

	// verify that there is one encounter rule loaded and its attributes
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

	// verify that the full encounter rule has been correctly loaded
	// and its attributes are the opposite of the defaults
	function verifyFullEncounterRuleLoaded(xmlString) {
		this.ruleset.parse(xmlString);

		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];

		let classesArray = [];
		for (let entry of rule.classes.values()) {
			classesArray.push(entry);
		}
		assert.sameMembers(classesArray,
			['class-1', 'class-2', 'class-3']);

		assert.equal(rule.id, 'encounter-default');
		verifyAttributesSwapped(rule);

		assert.lengthOf(rule.propList, 2);
		let prop = rule.propList[0];
		assert.equal(prop.id, 'property-with-id-and-classes');

		classesArray = [];
		for (let entry of prop.classes.values()) {
			classesArray.push(entry);
		}
		assert.lengthOf(prop.classes, 3);
		assert.sameMembers(classesArray,
			['pic-class-1', 'pic-class-2', 'pic-class-3']);
		assert.isFalse(prop.vis);
		assert.isFalse(prop.refresh);

		//[TODO]
	}

	//***** Throws *****
	it.skip('throws when the top-level rule does not have a valid tag',
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

	it('throws when the top-level encounter rule has an invalid attribute');

	it('throws when a property rule has an invalid attribute');


	// ***** Loads empty top-level encounter *****
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

	//***** Replaces top-level encounter *****
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
		rule = this.ruleset.vis.encounter[2];
		verifyAttributesSwapped(rule);
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyWithId3
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeAlter
			+ 'id="property-with-id"\n'
			+ 'refresh="false"\n'
			+ '></property>\n'
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyWithId3
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyWithId3
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeAlter
			+ 'id="property-with-id"\n'
			+ 'refresh="false"\n'
			+ '></property>\n'
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeAlter
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyWithId3
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyWithId3
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeAlter
			+ 'id="property-with-id"\n'
			+ 'refresh="false"\n'
			+ '></property>\n'
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
			+ xmlPropertyWithId1
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyWithId2
			+ '<property\n'
			+ xmlModeDelete
			+ xmlPropertyWithId3
			+ '</encounter>\n'
			+ '</visibility>\n'
			+ '</ruleset>\n';

		debugger;

		this.ruleset.parse(xmlString);
		assert.lengthOf(this.ruleset.vis.encounter, 2);

		let rule = this.ruleset.vis.encounter[1];
		assert.lengthOf(rule.propList, 0);

	});

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
			+ xmlPropertyNoIdNoClass1
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyNoIdNoClass2
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
			+ xmlPropertyWithId1
			+ '</encounter>\n'
			+ '<encounter mode="alter"\n'
			+ xmlEncounterId
			+ '>\n'
			+ '<property\n'
			+ xmlModeReplace
			+ xmlPropertyWithId2
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


	it('replaces a top-level encounter rule\'s property, same classes, '
		+ 'diff <visibility>');
		// 'same classes' means the two properties have the same classes
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

	it('does not replace a top-level encounter rule\'s property, '
		+ 'different id')
		// 'different ids' means the two properties have different ids

	it('does not replace a top-level encounter rule\'s property, '
		+ 'different class')
		// 'different classes' means the two properties have different
		// classes

	//***** Alters top-level encounter's property *****
	it('alters a top-level encounter rule\'s property, no id / class, '
		+ 'diff <visibility>');
		// 'no id / class' means the two properties have no id or class
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

	it('alters a top-level encounter rule\'s property, same id, '
		+ 'same <encounter>');
		// 'same id' means the two properties have the same id
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

	it('alters a top-level encounter rule\'s property, same classes, '
		+ 'diff <encounter>');
		// 'same classes' means the two properties have the same classes
		// 'diff <encounter>' means the two properties are in different
		// <encounter> elements within the same <visibility> element

	it('does not alter a top-level encounter rule\'s property, '
		+ 'different id')
		// 'different ids' means the two properties have different ids

	it('does not alter a top-level encounter rule\'s property, '
		+ 'different class')
		// 'different classes' means the two properties have different
		// classes

	//***** Deletes top-level encounter's property
	it('deletes a top-level encounter rule\'s property, no id / class, ',
		+ 'diff <encounter>');
		// 'no id / class' means the two properties have no id or class
		// 'diff <encounter>' 

	it('deletes a top-level encounter rule\'s property, same id, '
		+ 'diff <visibility>');
		// 'same id' means the two properties have the same id
		// 'diff <visibility>' means that the two properties are in two
		// different <encounter> elements within two different
		// <visibility> elements

	it('deletes a top-level encounter rule\'s property, same classes, '
		+ 'same <encounter>');
		// 'same classes' means the two properties have the same classes
		// 'same <encounter>' means the two properties are in the same
		// <encounter> element

	it('does not delete a top-level encounter rule\'s property, '
		+ 'different id')
		// 'different ids' means the two properties have different ids

	it('does not delete a top-level encounter rule\'s property, '
		+ 'different class')
		// 'different classes' means the two properties have different
		// classes

	//***** Loads kind-specific encounter *****
	// not doing inherited / own modes for these as the top-level rule
	// tests already cover that
	it('loads an empty kind-specific encounter rule, mode="replace"');

	it('loads an empty kind-specific encounter rule, mode="alter"');

	it('does not load an empty kind-specific encounter rule, '
		+'mode="delete"');
	//[TODO]

	it('loads a full top-level encounter rule, mode="replace"');

	it('loads a full top-level encounter rule, mode="alter"');

	it('does not load a full top-level encounter rule, mode="delete"');

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


	//[TODO] test for validate()

}

