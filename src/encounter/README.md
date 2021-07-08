[TODO] modifiers - an effect that targets another effect
[TODO] effect priority (set priority 300 for additive, priority 400 for
multiplicative, priority 100 for interrupt effects that are additive,
priority 200 for interrupt effects that are multiplicative etc);
[TODO] encounter visibilities (whether characters' actions are known, 
 etc.)

# Social Encounter Engine
The social encounter engine is a non-violent combat-like turn-based RPG
encounter engine meant to simulate social conflicts, such as debates,
trials before a judge, religious evangelization, pleas for one party to
spare another party's life or other kinds of acts of persuasion. With some
tinkering, the  engine can accommodate other forms of conflict such as
hacking. The engine aims to provide a whole host of different kinds of
gameplay that would be impossible to deliver in a standard, combat-focused
RPG.

The way the social encounter engine works is straightforward: there are
rules for different kinds of encounters, the kinds of actions that can be
performed within them, the kinds of arguments that can be created in them
etc. The engine makes no assumptions about what properties you give your
characters, arguments etc, although it's customary for them to have at
least a 'conviction' stat (the equivalent of hit points) and an 'energy'
stat (the equivalent of mana). For an example of what the engine can do,
see the game [Faith of the Apostles]([TODO]).

**Actions** are performed by _characters_ on _arguments_, _boosters_ and
other _characters_; actions have _effects_ that they perform on the
_properties_ of their targets (e.g. decreasing a 'conviction' property),
have _costs_ that affect the _properties_ of some entity (usually the
character performing the action), and _conditions_ that determine whether
they can be carried out. Actions take one or more turns to complete.

**Arguments** are created by a _character_ over the course of one or more
turns and continually have _effects_ on their targets. They can be
retargeted using a special 'retarget' action, and their targets can be
_characters_, _boosters_ or other _arguments_. Arguments can be
assigned to _characters_, i.e. developed by them, and can store a limited
number of _boosters_ that affect the argument and those developing it.
Arguments also have their own _properties_ (so they are in a way like
summoned creatures) as well as their own _conditions_ that determine
whether the arguments can be created, and their own _traits_. It is
expected that arguments gradually lose effectiveness and disappear over
time if they are not continuously developed, although this is something
that your ruleset ultimately decides.

**Boosters** are created by _characters_ and continually have _effects_.
They can be **global boosters**, which do not attach to an _argument_, or
ordinary boosters, which do. Boosters may not be developed by _characters_
the way _arguments_ can be developed, although their stats may change as
_characters_ develop the _arguments_ they are attached to. Like _arguments_,
they have their own _properties_, as well as _conditions_ that determine
in which situations they can be created.

**Characters** may be summoned by other _characters_ (if the actions for
summoning them exist) and may perform _actions_, including developing
and creating _arguments_, retargeting _arguments_ and creating _boosters_.
Characters have their own _properties_ and _traits_ and may receive
_effects_. Characters can belong to one of three sides: side 1 (usually the
player's side), side 2 (usually the AI's side) or side 0, i.e. the neutral
side.

**Effects** are applied to all kinds of game entities (the things
shown in bold here), even to other effects, usually as a result of an
action being performed, though some effects are permanent and can even
be applied to the whole encounter, possibly after being researched or
discovered as _secrets_.

Note that actions, arguments, boosters, characters and effects are
researchable within an encounter, provided certain _costs_ are paid,
and may be present as _secrets_ that can be uncovered using a mechanic
called _probing_. Probing allows an effect to continually increase the
_probing_ score on a character or argument, which gradually reveals
the properties of a character or an argument (or those of the argument's
boosters), the character or argument's kind (or those of its boosters)
and the character's ongoing action. In addition, they can reveal a
character's or encounter's _secrets_, which are very powerful actions,
arguments, boosters and other characters that can all be created once the
secret is learned, or effects that take place immediately once the secret
is learned. Learning an opponent's secrets gives considerable advantages;
the protagonist and his/her party can have secrets too, and all secrets
may be assigned to characters via _traits_, allowing for the interesting
possibility of giving the party various vulnerabilities they can select
from such as 'secret guilt' or 'secret fear'.

**Encounters** may have _traits_ and _properties_ of their own, and declare
what _traits_ and _properties_ each side in the encounter has. It is
customary for both sides facing off in an encounter to have a 'research'
score that may be spent to purchase new researchable arguments, boosters
etc., but this is not required.

**Traits** are attached to _characters_, _arguments_, the _sides_ present
in an encounter and the _encounter_ itself, and may be assigned to
_arguments_ when creating them or purchased by characters alongside bonuses
to their _properties_ when gaining experience or leveling up (gaining
experience is not accounted for in the social encounter engine). Traits
have _effects_ that they continuously apply, usually on the entities that
possess them.

**Costs** affect _properties_ and are expended by _actions_, by research
(which is instantaneous) and by adding _traits_ to a given _argument_ or
_character_ when creating them. If the _conditions_ for a cost are not met
after the cost is performed (e.g. if the property that the cost is deducted
from were to become less than zero), the cost will not be performed and
the _action_, research or creation it affects will not be carried out.

**Conditions** are used by _actions_, _arguments_, _boosters_, 
_characters_ and _traits_ to decide under what circumstances they can be
carried out or created. In addition, they affect _costs_ to decide whether
the cost is successfully expended and _effects_ to determine when they are
carried out.

## Getting started
You can use the rules that come packaged with this module or create the
rules for your own RPG by specifying them in an XML file or files,
XML strings or XML documents. You can also modify the rules that come
with the module by creating new rules with the `mode="alter"` attribute set
on your new rules, which will partially overwrite the old rules. Thus, the
engine is fully suited for modding.

If you prefer to check out the engine with a pre-built ruleset, first set
up your module bundler (e.g. webpack) to bundle xml files. For Webpack, this
means importing file-loader and setting it up in your Webpack
configuration file:
```
[TODO]
```

After setting up your module bundler, put the following in your javascript
file:

```
import { Ruleset, encounterConfig, EncounterManager } from [TODO];
import xmlRules from [TODO];
import xmlEncounter from [TODO];

const ruleset = new Ruleset(xmlRules);
ruleset.validate(); //optional
encounterConfig = EncounterManager.parse(encounterConfig, ruleset, null,
	xmlEncounter);
const manager = new EncounterManager(encounterConfig);
```

To start the social encounter engine in your game with your own rules,
there are two ways to do it: the code way and the XML way. The code way
involves creating rules for various kinds of game entities by first creating
these entities using code (see the code documentation for that), then
adding them to the ruleset by doing:
```
//...
import { ActionKind, CharacterKind, 
	//... 
} from [TODO];

const myActionKind = new ActionKind(
	//...
);
const myCharacterKind = new CharacterKind(
	//...
);
//...

const ruleset = new Ruleset().add(
	myActionKind,
	myCharacterKind,
	//...
);

ruleset.validate(); //optional
```

Alternatively (and this is the preferred way), you can write your XML
ruleset as a string or a file loaded as a string, then do:
```
import { Ruleset } from [TODO];

const ruleset = new Ruleset(myRules);
ruleset.validate(); //optional

It's encouraged, but optional, to run `ruleset.validate()` to ensure that
there are no problems with your ruleset after all rules have been written
into it.

To then load an encounter using your ruleset, do:
```
import { encounterConfig, EncounterManager } from [TODO];

encounterConfig.ruleset = ruleset;

const Char1 = ruleset.chars[0].create('char-1')
[TODO][put create() in the code];
// set up your character
// ...

const Char2 = ruleset.chars[0].create('char-2')
[TODO][put create() in the code];
// set up your character
// ...

encounterConfig.side1.chars = [Char1];
encounterConfig.side2.chars = [Char2];

const manager = new EncounterManager(encounterConfig);
```
This will create an encounter with two opposing characters in it,
char-1 and char-2.

You can also store part or all of your encounter in an xml string to make
loading it easier. Calling your string 'myEncounter', simply do:

```
import { encounterConfig, EncounterManager } from [TODO];

encounterConfig = EncounterManager.parse(encounterConfig, ruleset, null,
	myEncounter);

const manager = new EncounterManager(encounterConfig);
```
NOTE: if the id string in EncounterManager.parse() is set to `null`, as
above, the string `myEncounter` must contain a single set of
<encounter></encounter> tags. Otherwise, specify the encounter you want
to load via the id string. [TODO]

This will add all entities in the xml encounter string into the encounter's
configuration.

You can put multiple rulesets (e.g. from multiple xml files) into your
game's ruleset object. Simply do:

```
const ruleset = new Ruleset(myRules1, myRules2, myRules3);
```

or:

```
const ruleset = new Ruleset(myRules1).parse(myRules2).parse(myRules3);
```

It is possible to load some rules from code using `ruleset.add()` and
others from xml using `ruleset.parse()`.

The following documentation assumes you are loading rules and encounters
from xml data.

### Tutorial
[TODO]


## Ruleset XML
The social encounter engine uses [XML](https://www.w3schools.com/xml/) for
writing its rulesets and individual encounters. XML is easy to use and can
be learned quickly. This chapter describes the XML elements that make up
the rules of a ruleset, which must encompass all the rules for a given
type of social encounter. There is usually one ruleset per game.

The ruleset object loads the rules from xml files or strings that contain
`<ruleset></ruleset>` tags.

Each XML rule must be part of a ruleset, being included in the
`<ruleset></ruleset>` tag. For instance, an action rule would be included
as:
```
<ruleset>
	<action>
	...
	</action>
</ruleset>
```

If using multiple kinds of encounters, you can include your rules for 
actions, arguments etc. inside an <encounter> rule, where you also put your
encounter traits.


Each file being parsed by a ruleset should have at least one
`<ruleset></ruleset>` tag. The same rule, with the same id attribute, may
be included in multiple rulesets, in which case the `mode` of each
instance of the rule will apply to the previous instance, so that, for
example, if we have 
```
<ruleset>
	<action id="action-explain">
		<class>class-that-remains</class>
		<class>class-that-gets-deleted</class>
		...
	</action>
</ruleset>
<ruleset>
	<action id="action-explain" mode="alter">
		<removeClass>class-that-gets-deleted</removeClass>
	</action>
</ruleset>
```
then what this does is first create the action `action-explain` with both
of its classes, then remove the class `class-that-gets-deleted` from the
list of its classes.

Each rule within a ruleset has an **id**, which must be unique to that
rule. The id must normally be a string and _should have the name of the
rule's kind_ (`action`, `argument`, `character` etc.) written at the
beginning of the id, e.g. `'action-explain'`, but in the case of a
rule for a condition, effect, cost or modifier that is not a top-level
rule, the id can be a number, in which case the social encounter engine's
XML parser converts this number into a string that contains the id of the
rule's parent rule, plus the name of the rule's kind between hyphens (e.g.
'-cost-'), plus the numerical id specified. For instance, if we have:
```
<action id="action-explain">
	<cost id="1">
		...
	</cost>
</action>
```
Then the cost of this action will have the id "action-explain-cost-1".

Words in an id should be separated by hyphens (i.e. they should have
kebab-case). Also, it is strongly recommended that rules that are used as
templates for other rules (using the `<copyById>` tag) have a string-based
id.

All top-level rules, i.e. rules that are the direct children of a 
`<ruleset>` tag, must have a string id; likewise, <action>, <argument>,
<booster>, <character>, <encounter> and <trait> rules must have an id no
matter where they are in the XML tree. Top-level <...Condition>, <cost>
and <effect> rules are considered templates that are copied
into other rules of their kind, so they must also have string ids.

Each rule within a ruleset, as well as the ruleset itself, may also have a
**mode** attribute, which determines how the rules written into
later-loaded rulesets affect rules written into previously-loaded rulesets.
Rulesets that show up later in the same XML string will be loaded later;
if they are in different strings, the order in which they are inserted into
the game's ruleset object will determine when they are loaded.

If a ruleset has a mode, that mode is applied by default to all of its
rulesets. In addition, rulesets can have the **wipe="all"** attribute,
which will delete _all_ rules of the previous rulesets. This attribute
allows Total Conversions to be created and loaded after other rulesets
have been loaded.

If the mode attribute is missing or is set to **"replace"** in a given
instance of the rule, (given the example of an action rule, we write
`<action ... mode="replace">` or do not write any mode at all, i.e.
`<action ...>`), that instance of the rule will replace the previous
instance of the rule completely.

If the mode attribute is set to **"alter"** in an instance of the rule (e.g.
`<action ... mode="alter">`), this instance will overwrite only the parts
of previous instances of the rule specified in this instance of the rule,
and will append the other parts, so that, for instance:
```
<ruleset>
	<action id="action-explain">
		<targets>
			<number>3</number>
			...
		</targets>
	</action>
</ruleset>
<ruleset>
	<action id="action-explain" mode="alter">
		<targets>
			<number>2</number>
			...
		</targets>
	</action>
</ruleset>
```
This causes the action's targets to become two instead of three.

This effect will cascade to any children of the rule and their own
children unless another mode is specified for them, so that, for instance,
```
<action id="action-explain" mode="alter">
	<cost id="1">
		<value>-10</value>
	</cost>
</action>
```
will not replace the cost with a new one, but will instead alter it to have
a value of -10.

### Action

### Argument

### Booster

### Character

### Code

### Condition

### Cost

### Effect

### Encounter

### Trait


























