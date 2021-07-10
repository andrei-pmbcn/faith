const assert = require('chai').assert;
import { ParserError } from '~/src/encounter/ruleset.js';
import { _VisTopLevel } from '~/src/encounter/ruleset2.js'; 

export default function visibilityRules() {
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

	// ***** Loads empty top-level encounter *****
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

	let xmlEncounterId = 'id="encounter-default"\n'
	let xmlEncounterIdDifferent = 'id="encounter-different"\n'
	let xmlEncounterClasses = 'class="class-1,  class-2,  class-3  "\n'
	let xmlEncounterClassesDifferent = 'class="class-100, class-3"\n'

	// these are the default encounter attributes
	let xmlEncounterAttributesDefault = 
		'properties="false"\n'
		+ 'propertiesRefresh="false"\n'
		+ 'traits="true"\n'
		+ 'traitsRefresh="false"\n'
		+ 'secrets="false"\n'
		+ 'secretsRefresh="false"\n'
		+ '>\n'

	// these are the complete opposite of the encounter attributes
	let xmlEncounterAttributesSwapped = 
		'properties="true"\n'
		+ 'propertiesRefresh="true"\n'
		+ 'traits="false"\n'
		+ 'traitsRefresh="true"\n'
		+ 'secrets="true"\n'
		+ 'secretsRefresh="true"\n'
		+ '>\n'

	// one property has an id and class, the other does not
	let xmlEncounterProperties3 = 
		+ '<property\n'
		+ 'id="property-type1"\n'
		+ 'class="class-1,class-2,class-5"\n'
		+ 'vis="true"\n'
		+ 'refresh="false"\n'
		+ '></property>\n'
		+ '<property\n'
		+ 'mode="alter"\n'
		+ 'vis="false"\n'
		+ 'refresh="true"\n'
		+ '></property>\n'

	let xmlFullEncounter =
		xmlEncounterId
		+ xmlEncounterClasses
		+ xmlEncounterAttributesSwapped
		+ xmlEncounterProperties3


	// verify that the attributes of the rule are equal to the defaults
	function verifyAttributesDefault(rule) {
		assert.isFalse(rule.properties);
		assert.isFalse(rule.propertiesRefresh);
		assert.isTrue(rule.traits);
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

	// verify that the full encounter rule has been correctly loaded
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
	}




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
		// 'different ids' means the two encounter rules have different ids

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
	it('alters a top-level encounter rule, no id / class');

	it('alters a top-level encounter rule, same id');

	it('alters a top-level encounter rule, same classes');

	it('does not alter a top-level encounter rule, different ids');

	it('does not alter a top-level encounter rule, different classes');


	//***** Deletes top-level encounter *****
	it('deletes a top-level encounter rule, no id / class');

	it('deletes a top-level encounter rule, same id');

	it('deletes a top-level encounter rule, same classes');

	it('does not delete a top-level encounter rule, different ids');

	it('does not delete a top-level encounter rule, different classes');

	//***** Replaces top-level encounter's property *****
	it('replaces a top-level encounter rule\'s property, no id / class');

	it('replaces a top-level encounter rule\'s property, same id');

	it('replaces a top-level encounter rule\'s property, same classes');

	it('does not replace a top-level encounter rule\'s property, '
		+ 'different id')

	it('does not replace a top-level encounter rule\'s property, '
		+ 'different class')

	//***** Alters top-level encounter's property *****
	it('alters a top-level encounter rule\'s property, no id / class');

	it('alters a top-level encounter rule\'s property, same id');

	it('alters a top-level encounter rule\'s property, same classes');

	it('does not alter a top-level encounter rule\'s property, '
		+ 'different id')

	it('does not alter a top-level encounter rule\'s property, '
		+ 'different class')

	//***** Deletes top-level encounter's property
	it('deletes a top-level encounter rule\'s property, no id / class');

	it('deletes a top-level encounter rule\'s property, same id');

	it('deletes a top-level encounter rule\'s property, same classes');

	it('does not delete a top-level encounter rule\'s property, '
		+ 'different id')

	it('does not delete a top-level encounter rule\'s property, '
		+ 'different class')

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

	it('replaces a kind-specific encounter rule, same id');

	it('replaces a kind-specific encounter rule, same classes');

	it('does not replace a kind-specific encounter rule, different ids');

	it('does not replace a kind-specific encounter rule, different '
		+ 'classes');


	//***** Alters kind-specific encounter *****
	it('alters a kind-specific encounter rule, no id / class');

	it('alters a kind-specific encounter rule, same id');

	it('alters a kind-specific encounter rule, same classes');

	it('does not alter a kind-specific encounter rule, different ids');

	it('does not alter a kind-specific encounter rule, different classes');

	//***** Deletes kind-specific encounter *****
	it('deletes a kind-specific encounter rule, no id / class');

	it('deletes a kind-specific encounter rule, same id');

	it('deletes a kind-specific encounter rule, same classes');

	it('does not delete a kind-specific encounter rule, different ids');

	it('does not delete a kind-specific encounter rule, different classes');

	//***** Replaces kind-specific encounter's property *****
	it('replaces a kind-specific encounter rule\'s property, '
		+ 'no id / class');

	it('replaces a kind-specific encounter rule\'s property, '
		+ 'same id');

	it('replaces a kind-specific encounter rule\'s property, '
		+ 'same classes');

	it('does not replace a kind-specific encounter rule\'s property, '
		+ 'different id')

	it('does not replace a kind-specific encounter rule\'s property, '
		+ 'different class')

	//***** Alters kind-specific encounter's property *****
	it('alters a kind-specific encounter rule\'s property, no id / class');

	it('alters a kind-specific encounter rule\'s property, same id');

	it('alters a kind-specific encounter rule\'s property, same classes');

	it('does not alter a kind-specific encounter rule\'s property, '
		+ 'different id')

	it('does not alter a kind-specific encounter rule\'s property, '
		+ 'different class')

	//***** Deletes kind-specific encounter's property *****
	it('deletes a kind-specific encounter rule\'s property, '
		+ 'no id / class');

	it('deletes a kind-specific encounter rule\'s property, '
		+ 'same id');

	it('deletes a kind-specific encounter rule\'s property, '
		+ 'same classes');

	it('does not delete a kind-specific encounter rule\'s property, '
		+ 'different id')

	it('does not delete a kind-specific encounter rule\'s property, '
		+ 'different class')

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

