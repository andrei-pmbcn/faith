TODO 'default' attribute to all entity kinds
TODO modifiers - an effect that targets another effect
TODO effect initiative (set initiative 300 for additive, initiative 400 for
multiplicative, initiative 100 for interrupt effects that are additive,
initiative 200 for interrupt effects that are multiplicative etc);
TODO XX prop.side1, prop.side2, prop.side0 - the value of that property
related to a given side; e.g. research.side1 and (for neutral characters)
probing.side1 and conviction.side1. XX
TODO ruleset-specific attributes, e.g. stating whether items are owned by
characters or belong to a side-specific pool from which any character on that
side may freely use or equip them
TODO inside encounters, option to truncate decimals of float values
to e.g. 0, 2 or 3 decimal points
TODO check all links

# Social Encounter Engine
The social encounter engine is a turn-based RPG encounter engine that can
simulate combat but is meant to primarily simulate social conflicts, such
as debates, trials before a judge, religious evangelization, pleas for one
party to spare another party's life or other kinds of acts of persuasion.
The engine is both powerful and generic and can simulate any kind of 
action you can think of. Want an action that increases the energy (if your
game even has an energy stat) of three targets, but only if one of them is
an enemy? Go for it. You can even do things like research abilities and
reveal the opposing team's hidden stats during an encounter with this
engine.

You write the rules for your game and scenarios for your
encounters in xml and load them into the engine, then run an encounter,
input the orders for the characters on ech side, simulate turns
and handle the game events that arise during these turns. The basics are
easy to pick up (see the tutorial), while there are many intricacies for
advanced users to learn.

The engine does not simulate spatial locations, so you can't calculate
things like splash damage from fireballs or loud shouting. It also doesn't
allow for the scenery of the encounter to be used (e.g. overturning table
or chair objects) as it is primarily focused on social encounters. Still,
most turn-based JRPGs could easily be simulated by it.

At the core of the engine is the distinction between 'actions', which are
preformed by characters, and 'arguments' (as in, elements of persuasion),
which are created by characters. Once created, arguments continuously take
effect, for instance by decreasing a 'conviction' property of targeted
charcters on the opposing team, and they grow in power during the turns
when characters work to _develop_ them. They can have their own properties;
in the game Faith of the Apostles, they have a property called 'relevance'
among others, which acts like hit points and continously goes down. Thus,
arguments behave somewhat like summons in standard RPGs. If you want to
create a standard RPG with this engine, you can skip arguments and their
counterpart, boosters, altogether.

The way the social encounter engine works is straightforward: there are
rules for different kinds of encounters, the kinds of actions that can be
performed within them, the kinds of characters that can be present in them
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
ordinary boosters, which do. Only one booster of a given kind may exist
on an argument, or as a global booster, at a given time. Boosters may not
be developed by _characters_ the way _arguments_ can be developed,
although their stats may change as _characters_ develop the _arguments_
they are attached to. Like _arguments_, they have their own _properties_,
as well as _conditions_ that determine in which situations they can be
created.

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
the properties and traits of a character or an argument or booster (or the
properties of the argument's boosters), the encounter's traits, the
character or argument's kind (or those of its boosters) and the
character's identity (visible from the start by default) and ongoing
action. In addition, they can reveal a character's or encounter's
_secrets_, which are very powerful actions, arguments, boosters and
other characters that can all be created once the secret is learned,
or effects that take place immediately once the secret is learned.
Learning an opponent's secrets gives considerable advantages; the
protagonist and his/her party can have secrets too, and all secrets
may be assigned to characters via _traits_, allowing for the interesting
possibility of giving the party various vulnerabilities they can select
from such as 'secret guilt' or 'secret fear'.

**Encounters** may have _traits_ and _properties_ of their own, and declare
what _traits_ and _properties_ each side in the encounter has. It is
customary for both sides facing off in an encounter to have a 'research'
score that may be spent to purchase new researchable arguments, boosters
etc., but this is not required.

**Items** TODO

**Traits** are non-numerical qualities attached to _characters_,
_arguments_, _items_, the _sides_ present in an encounter and the
_encounter_ itself, and may be assigned to _arguments_ when creating them or
purchased by characters alongside bonuses to their _properties_ when gaining
experience or leveling up (gaining experience is not accounted for in the
social encounter engine). Traits have _effects_ that they continuously apply,
usually on the entities that possess them.

**Properties** are numerical qualities attached to _characters_, _actions_
_arguments_, _boosters_, _items_, _traits_, the _sides_ present in an
encounter and the _encounter_ itself. Property may be stand-alone or
partially or fully derived from other properties (for instance, the 'energy'
property in Faith of the Apostles is made up of a base amount plus the
average of the  character's 'spirit' and 'intelligence' properties).

**Costs** modify _properties_ and are expended by _actions_, by research
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

## Running your own game
If you just want to mod or create campaigns / scenarios for an already
existing game that uses this engine, skip this section.

You can use the rules that come packaged with this module or create the
rules for your own RPG by specifying them in an xml file or files,
xml strings or xml documents. You can also modify the rules that come
with the module by creating new rules with the `mode="alter"` attribute set
on your new rules, which will partially overwrite the old rules. The engine
is designed with modding in mind.

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
there are two ways to do it: the code way and the xml way. The code way
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

Alternatively (and this is the preferred way), you can write your xml
ruleset as a string or a file loaded as a string, then do:
```
import { Ruleset } from [TODO];

const ruleset = new Ruleset(myRules);
ruleset.validate(); //optional
```

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
`<encounter></encounter>` tags. Otherwise, specify the encounter you want
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
The social encounter engine uses [xml](https://www.w3schools.com/xml/) for
writing its rulesets and individual encounters. You write your text files
in xml and pass them on to the engine for processing. xml is easy to use
and can be learned quickly. In summary, xml consists of 'elements', each of
which comprises a pair of 'tags' (the opening and closing tags) and
everything contained between them, so an empty element called myElement
would look like:
```
<myElement></myElement>
```
Note the slash at the start of the closing tag, which marks it as a closing
tag. For every opening tag, there must also be a closing tag that marks the
end of the element.

Elements may contain other elements, like so:
```
<myElement>
	<myOtherElement>
	</myOtherElement>
</myElement>
```

Elements may also have attributes, like so:
```
<myElement
	myAttribute="value1"
	myOtherAttribute="value2"
></myElement>
```
Put attributes inside your opening tag. Separate them with spaces and
newlines but not commas.


Finally, elements can contain text, like so:
```
<myElement>This is the element's text</myElement>
```

You can also include comments in xml, which will not be parsed, like so:
```
<myElement>
	<!-- xml is easy! -->
</myElement>
```
If you do something wrong in your xml file, you will get an error message
once the engine parses the xml. This error message always includes the
line number in your xml file.

[TODO]









Tips for developers:
* Test every little rule after you write it. Don't write huge blocks of
rules and test them later (or not at all), because you _will_ run into
errors.



## Ruleset Xml
This chapter describes the xml elements that make up
the rules of a ruleset, which must encompass all the rules for a given
type of social encounter. There is usually one ruleset per game.

The ruleset object loads the rules from xml files or strings that contain
`<ruleset></ruleset>` tags.

Each xml rule must be part of a ruleset, being included in the
<ruleset> element. For instance, two action rules would be included
as:
```
<ruleset>
	<action id="action-explain">
	...
	</action>
	<action id="action-discuss">
	...
	</action>
</ruleset>
```

If using multiple kinds of encounters, you can include your rules for 
actions, arguments etc. inside an `<encounter>` rule, where you also put
your encounter traits.


Each file being parsed by a ruleset should have at least one
`<ruleset>` element. The same rule, with the same id attribute, may
be included in multiple rulesets, in which case the `mode` of each
instance of the rule will apply to the previous instance, so that, for
example, if we have 
```
<ruleset>
	<action
		id="action-explain"
		class="class-that-remains,
			class-that-gets-deleted"
	>
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
rule's basic entity_ (`action`, `argument`, `character` etc.) written at
the beginning of the id, e.g. `'action-explain'`, but in the case of a
rule for a condition, effect or cost that is not a top-level
rule, the id can be a number, in which case the social encounter engine's
xml parser converts this number into a string that contains the id of the
rule's parent rule, plus the name of the rule's kind between hyphens (e.g.
`'-cost-'`), plus the numerical id specified. For instance, if we have:
```
<action id="action-explain">
	<cost id="1">
		...
	</cost>
</action>
```
Then the cost of this action will have the id `"action-explain-cost-1"`.

Words in an id should be separated by hyphens (i.e. they should have
kebab-case). Also, it is strongly recommended that rules that are used as
templates for other rules (using the `<copyById>` tag) have a string-based
id. The id may not be `getByName`, `getByClasses` or `_defaults` because
these are used by certain code in the engine, but you should not be using
camel case (e.g. 'thisIsCamelCase') or underlines for ids to begin with.

All top-level rules, i.e. rules that are the direct children of a 
`<ruleset>` tag, must have a unique id. Top-level `<...Condition>`, 
`<cost>` and `<effect>` rules are considered templates that are copied
into other rules of their kind, so they must also have string ids.

Each rule within the ruleset may have a list of comma-separated **classes**
as an attribute. These classes are text labels meant to group different rules
together and allow actions, conditions and effects to target them
specifically. For instance, an action called `action-neutralize` may be
configured to only target adverse boosters (which have negative effects), and
to target these boosters because they have the class `booster-adverse`. You
can put in whatever classes you believe you need for your ruleset, or none
at all.

All classes specified in an entity kind's `class` attribute are actually
added to instances of the entity itself, so for instance, if character kind
`character-mage` has the classes `character-spellcasting` and
`character-weak`, then all entities of the `character-mage` kind will have
the `character-spellcasting` and `character-weak` classes.

Example of classes:
```
<argument class="trait-conviction-increasing, trait-low-cost">
	...
</argument>
```

Each rule within a ruleset, as well as the ruleset itself, may also have a
**mode** attribute, which determines how the rules written into
later-loaded rulesets affect rules written into previously-loaded rulesets.
Rulesets that show up later in the same xml string will be loaded later;
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
This causes the action's number of targets to become two instead of three.

This effect will cascade to any children of the rule, their own
children and so on unless another mode is specified for them, so that,
for instance, we have:
```
<action id="action-explain" mode="alter">
	<cost id="1">
		<value>-10</value>
	</cost>
</action>
```
This will not replace the cost with a new one, but will instead alter it
to have a value of -10.

If the mode attribute is set to **delete** in an instance of the rule, the
rule will not be written, although its contents will still be parsed to
look for other rules inside them that will inherit the `delete` mode
unless they have their own explicitly-written modes. The rule itself and
any offspring in delete mode will delete their previous instances without
replacing them. This allows a mod to delete previously written rules.

Certain types of rules may have a **template** attribute that can be set
to `true` or `false`. If `true`, the rule will not be checked for
validation when a call to `ruleset.validate()` is made. This allows
incomplete rules to exist within the ruleset and to be used as templates
for other rules via the `<copyById>` element. All rules that can be
copied by Id from other rules have a template attribute.

Certain types of rules may also have a **default** attribute, set to `true`
or `false`. If true, the contents of the rule will be copied to all other
rules of its kind, except for other `default` rules. The default rule will
not overwrite any attributes or elements specifically written into the
rules that copy it.

### Action

### Argument

### Booster

All friendly boosters have the class 'firendly', all adverse boosters have
the class 'adverse'.



### Character

### Code

TODO


Non-standard variables:
`<code>` inside `<source>`: the piece of code may contain an array
called `sources` in addition to standard variables, and that array will
contain all the source properties.


### Condition


#### ExistsCondition

Attributes

kind - `true` or (by default) `false`; whether to count _kinds_ of
entities within the ruleset rather than entities witin the encounter
itself; for instance, if the ruleset has 4 argument kinds with the class 
`interest-restoring`, yet only one argument of any of these kinds (which has
the class `interest-restoring` because its kind has the class) is present
in the encounter, the condition will find 4 matches.

TODO

### Cost

### Effect

`create` - creates an entity

`destroy` - destroys an entity

`set` - sets one of the target's states to on.

`unset` - sets one of the target's states to off.

`toggle` - toggles one of the target's states from on to off and vice
versa


`flag` - the flag to be set, unset or toggled. Can be `active`, `alive` or
`finished`.




`maxOccurencesPerTurn` - the maximum number of times the effect will
occur each turn.

`maxOccurences` - the maximum number of times the effect will occur.
After this number is reached, the effect will be destroyed.

`ignoreMinimum` - whether to ignore the property's minimum; only applies if
the effect is affecting the property's current value and its `tethered`
value is set to `false`

`ignoreMaximum` - whether to ignore the property's maximum; only applies if
the effect is affecting the property's current value and its `tethered`
value is set to `false`






### Encounter
The `<encounter>` element describes a given kind of encounter
that will be available, storing the encounter kind's visibility rules, its
victory conditions and any rules for what kinds of actions, arguments etc.
are specific to the encounter. All encounter kinds have the 'encounter'
class.

The encounter element must have an **id** attribute and can have a
**name**, **class**, **mode**, **template** and **default** attribute. See
the [Ruleset Xml](#ruleset-xml) section for more information.

Every encounter kind has the `encounter` class. Any other classes that
encounter kinds have should be prefixed with `encounter-`.

The encounter element can have two (and only two) `<victory>` elements, which
describe the the victory conditions that are checked for a given side
at the end of each turn; specify the side to be checked in the `<victory>`
element's **side** attribute, i.e. `side="1"` or `side="2"`. The victory
conditions for a given side must _all_ be met for victory, although it is
possible to mix and match `<and>` and `<or>` elements to provide
alternative victory conditions.

Put your victory conditions inside `<victory>` like so:
```
<victory side="1">
	<condition>
		...
	</condition>
	<condition>
		...
	</condition>
</victory>
```

Or combine `<and>` and `<or>` elements:
```
<victory side="1">
	<or>
		<condition>
			...
		</condition>
		<and>
			<condition>
				...
			</condition>
			<condition>
				...
			</condition>
		</and>
	</or>
</victory>
```

The encounter can have any number of each of these child elements:
`<copyById>` - copies the contents of another `<encounter>` element into
this `<encounter>` element. Any rules specified in the target `<encounter>`
element take precedence over those specified in the source `<encounter>`
element.

`<addClass>` - when using `mode="alter"`, this allows you to add a class
to the encounter kind.

`<removeClass>` - when using `mode="alter"`, this allows you to remove a
class from the encounter kind. 

`<visibility>` - the encounter's visibility rules. See the
[visibility](#visibility) section for more information.

`<property>` - any property specific to the encounter itself. See the 
[Property](#property) section for more information.

`<trait>` - any trait specific to the encounter itself. See the
[Trait](#trait) section for more information. 

TODO













### Property
A `<property>` rule describes either a property kind, if it is placed in 
the top level (i.e. right under the `<ruleset>` tag), or an individual
property, if it is placed inside another entity tag such as `<encounter>`.

Each entity besides a property itself may have any number of properties,
although it may only have at most one property of a given kind. These
properties represent numbers, possibly calculated from other properties.

The property kind element must have an **id** attribute and can have a
**name**, **class**, **mode**, **template** and **default** attribute. See the
[Ruleset Xml](#ruleset-xml) section for more information.

Every property kind has the `property` class. Any other classes that property
kinds have should be prefixed with `property-`.

The property kind element must contain a **codeName** attribute that
specifies what the name used by the Social Encounter engine's code for this
property will be. This name should be a single word or a set of words written
in camelCase (i.e. the first letter of each word after the first is
capitalized, so it looksLikeThis). The codeName may only contain letters,
digits and underlines - no hyphens.

The property kind element may contain an optional `<visibility>` element
describing any visibility rules specific to it. These will override the
global rules stated in the optional top-level `<visibility>` tag (which is
right inside the `<ruleset>` tag).

The property kind element may also contain any number of `<addClass>` and
`<removeClass>` elements.

`<addClass>` - when using `mode="alter"`, this allows you to add a class
to the encounter kind.

`<removeClass>` - when using `mode="alter"`, this allows you to remove a
class from the encounter kind. 

The property kind element may also optionally contain a single `<val>`,
a single  `<min>` and a single `<max>` element. These describe how a
property's current (and initial) value, minimum value and maximum value 
respectively are calculated. If the property has a `<min>` or `<max>`
element, then whenever the property reaches its minimum or maximum value as
specified in these elements, it can go no further. Note that a property's
current, minimum and maximum values can be negative; to avoid making the
current value negative during encounters, use `<min base="0">`.

When `<min>` or `<max>` is not set, there is no minimum or maximum, but when
`<val>` is not set, it defaults to `<val base="0">`. If you want the current
value to initially equal the maximum value, e.g. if you want to start the
encounter with full hit points, use `<val base="max">`

Each of `<val>`, `<min>` and `<max>` has the following **attributes**:

`mode` - works as everywhere else. See the [Ruleset Xml](#ruleset-xml) for
more information.

`resetAfterEncounter` - whether the value should be reset after the encounter
is over. Can be `true` or `false`; `true` by default.

`base` - this is the amount that the property's current, minimum or maximum
value has when the property's holder entity is created, before the _sources_
or _coeff_ are calculated. It can be a number, or `min` or `max`, in which
case it takes on the value of the property's computed minimum value or
computed maximum value. It is an error for `<min>` to have `base="min"`, for
`<max>` to have `base="max"`, or for `<min>` to have `base="max"` and for
`<max>` to have `base="min"` at the same time. When `tethered="true"`, `base`
represents not just the initial value but is also used in recalculating the
current value every time a _source_ (see below) changes or an _effect_
occurs. `base` is 0 by default.

Note that `base` should only change when the item, character or side having
this property levels up or otherwise improves. It should _not_ change as part
of most effects.

TODO when `<max base="min">`, compute the min first, then the max; conversely,
when `<min base="max">`, compute the max first, then the min.

`costsChange` - how much the base value permanently changes when its costs are expended; 1 by default.

`coeff` - this is the amount that the current, minimum or maximum value will
be multiplied by after its _sources_ are processed. For instance, if a
property's initial value depends on another property P and another property
Q, and these sources are processed by taking their average, then the initial
value will be: `base + (0.5 * P + 0.5 * Q) * coeff`. `coeff` is 1 by default.

`process` - the calculation that the _sources_ will undergo to obtain a
value that will then be multiplied by the `coeff`, added to the `base`, and
thus assigned as the property's initial value or (if `tethered="true"`) used
to affect its current value according to the above equation.

`process` can be any of the following: `add` - adds the sources' values
together to obtain the final value. `multiply` - multiplies the sources'
values instead. `average` - takes the average of the source's values. `code`
 - computes the code to obtain the final value from the sources' values.

`tethered` - Determines whether the current, minimum or maximum value of the
property fluctuates freely (`tethered="false"`) or is merely offset from its
base (`tethered="true"`). If set to `true`, then whenever a change in the
property occurs, the new value of the propety is obtained relative to its
initial value. If set to `false`, it is obtained relative to the current
value. Use `tethered="true"` for properties like intelligence and maximum
hit points, and `tethered="false"` for properties like current hit points.

When `tethered="true"`, the following calculation occurs whenever the
sources or the effects that alter the property change:
```
value = (base + sourced * coeff + add) * mult
```
Where we have:

`base` - as the `base` attribute above

`sourced` - the value of the processed _sources_ (see below)

`coeff` - as the `coeff` attribute above

`add` - the additive values of all effects targeting the property

`mult` - the multiplicative values of all effects targeting the property

This means that, first, _all_ additive effects on the property are added
to the `add` value, then _all_ multiplicative effects are added to the _mult_
value, then `value` is computed as above.

When `tethered="false"`, the sources and base never affect the new
value, new minimum value or new maximum value respectively when these are
recalculated, while individual effects modify these values immediately,
rather than first being added to an `add` or `mult` value.

`<val>`, `<min>` and `<max>` can have the following **child elements**:

`<code>` - a piece of code to be run to process the _sources_; only works if
`<process>code</process>` is set. The piece of code may contain an array
called `sources` in addition to standard variables, and that array will
contain all the source properties. Only one `<code>` element may be present;
any `<code>` elements placed after it will overwrite it.

`<cost>` - a cost element (see [Cost](#cost)) that describes one of the costs
for permanently increasing or decreasing the value's `base` by a number stated
in the value's `costsChange` attribute.

`<source>` - any number of these may be present. Each `<source>` element
represents a property that, combined with the other source properties,
affects the initial value and (if tethered="true") contributes to recomputing
the value every time the sources change their own values. For instance, in
'Faith of the Apostles', the 'intelligence' and 'spirit' properties of a
given character, which are static, affect the maximum value of the
character's 'energy' property, and so they are that maximum value's
`sources`.

`<source>` may have the following attributes:

`kind` - required; the source property's kind.

`mode` - works as everywhere else. See the [Ruleset Xml](#ruleset-xml) for
more information. New `<source>` elements with a given mode will affect
previous elements in which the `kind` attribute has the same value.

`var` - the name of the variable that will represent the source in the
`<code>` element (not the `<holderCode>` element). For instance, if you have
two sources, one with `var="s1"` and the other with `var="s2"`, you can
reference them in the `<code>` element using the names `s1` and `s2`. Thus,
```
value = s1.val + 2 * s2.val
```
If a thus-named variable represents a source with multiple holders, it will
be an array, each element of the array being the property of the specified
`kind` within the given holder.

The `<source>` element also has any number of `<holder>` child elements. Each
holder represents an entity that has the property specified by `kind` and
whose property of that kind is counted as a source. By having multiple
holders under the same `<source>` tag, the engine will process the property
of the  specified `kind` in each of these holders. So, for instance, if we
have a property `property-side-power` that will be assigned to the team's
side, and it has two sources, the total `power` of the team's arguments and
the total `power` of its boosters, it will have the following `<source>`
element:

```
<source
	kind="property-power"
>
	<holder
		id="1"
		side="friendly"
		targetType="allArguments"
	></holder>
	<holder
		id="2"
		side="friendly"
		targetType="allBoosters"
	></holder>
</source>
```

You can, of course, create two different sources for the same result:
```
<source kind="property-power">
	<holder
		id="1"
		side="friendly"
		targetType="allArguments"
	></holder>
</source>
<source kind="property-power">
	<holder
		id="1"
		side="friendly"
		targetType="allBoosters"
	></holder>
</source>
```

The attributes and child elements that the `holder` property can have are
discussed in the [Targets](#targets) section.

If no `<holder>` element exists, the property's holder will be regarded as
the source's holder, so it will be the same as
`<holder targetType="holder"></holder>`.

Example of a property kind element:
```
<property
	id="property-energy"
	codeName="energy"
	name="energy"
	class="property-character, property-stat"
>
	<val base="max">
	<min base="0" tethered="true">
	<max
		base="50"
		coeff="3.0"
		costsChange="10"
		tethered="true"
		process="average"
	>
		<source kind="property-intelligence"></source>
		<source kind="property-spirit"></source>
		<cost>TODO</cost>
	</max>
</property>
```
This will create a property 'energy' with a default minimum of 0, a default
maximum of `50 + ((intelligence + spirit) / 2) * 3.0` and an initial value
equal to the maximum. It will cost TODO to increase this property by 10
points.

As mentioned earlier, <property> can also sit inside other entity elements
like characters, boosters and items, in which case it is an
individual-property element that has no child elements, and represents the
fact that the character, booster etc. in question has the property of the
given kind. The individual-property element must have a **kind** attribute,
which contains the id of the property's kind (i.e. the top-level `<property>`
rule from which it derives all its traits. It can optionally have a
**baseValue**, **baseMin**, **baseMax**, **coeffValue**, **coeffMin** and
**coeffMax** attribute, each of which overrides the base or coeff attributes
in the property kind's `<value>`, `<min>` or `<max>` elements. If you do not
specify these, the property kind's own values will be used.

Example:
```
<character
	...
>
	<property
		kind="property-influence"
		baseValue="150"
		coeffValue="1.5"
		baseMax="300"
		coeffMax="1.5"
	></property>
</character>
```

### Targets
Some elements contain a <target> sub-element, which describes one of their
targets. Likewise, the `<source>` elements inside `<property>` elements have
a `<holder>` sub-element that shows which entity or entity kind encapsulates
these `<source>` elements. So, for instance, if a `<source>` element in a
`<property>` contains a `<holder targetType="creator"></holder>` sub-element,
that sub-element will point to the entity that has ultimately created the
entity holding the given property.

The concept of "holders" is important in targeting. Many entities within an
encounter are holders for other entities: arguments are holders for their
boosters and traits, characters are holders for their items and unfinished
actions (as well as any unfinished argument, booster or character they
might be creating) and all non-property entities are holders for their
properties. When a character holds an item that holds a trait that holds a
property, for instance, we speak of a chain of holders going up from that
property to the character.

A `<target>` or `<holder>` element must contain an **id** attribute, which 
can (and indeed should) be numeric, with a number that is unique among the
`<target>` or `<holder>` elements of the element's parent. For instance:
```
<property
	id="property-whatever"
>
	<val>
		<source
			kind="property-whatever-else"
		>
			<holder
				id="1"
				targetType="allArguments"
			></holder>
			<holder
				id="2"
				targetType="allBoosters"
			></holder>
		</source>
	</val>
</property>
```
Here, the two holders have ids "1" and "2", which must be distinct.

A `<target>` or `<holder>` element may also contain a **mode** attribute,
which describes the element's mode as shown in the
[Ruleset Xml](#ruleset-xml) section, a **targetId** attribute that makes the
element refer to the entity having the specified id, a **targetKindId**
attribute that selects for only entities that have the specified _kind_, a
**targetClass** attribute that selects for only entities with the
specified classes, and a **notTargetClass** attribute that filters out
entities that have the specified classes.

TODO a **wearSlots** attribute, which can contain a comma-separated list of
wear slots and filters for only those items that would use the specified wear
slots, regardless of whether they are being equipped right now. If the list is
empty (i.e. wearSlots="") it will be ignored.

In addition, the element may contain a **side** attribute, which
states which side contains the targets and can have the following values:

`all` - all sides; the default, so it needs not be specified

`friendly` - the entity's own side in the encounter

`opposing` - the opposing side in the encounter. If the friendly side is the
neutral side, then the opposite side constitutes both of the other sides.

`neutral` - the neutral side in the encounter

`side1` - side 1 in the encounter, usually the player's side

`side2` - side 2 in the encounter, usually the AI-controlled side

For `friendly` or `opposing`, if the entity holding the `<target>` or
`<holder>` element does not have a side, then the side of its holder, or that
of its holder's holder and so on, will be used to determine this instead.

The element may also have a **finished**, an **active** and an **alive**
attribute, which selects entities to target based on their given finished,
active and alive states. If the entity's creation has been completed, it is
finished. If the entity is active, it can perform actions (if it is a
character) or be used (if it is an item). If the entity is alive, it
processes all effects applied to it (by default, no effects affect dead
entities). These three attributes may have a value of "true", "false" or
"null"; in the latter case, they tell the engine not to match against these
flags.

The element must contain a **targetType** attribute set to one of the
following values, which further filter the designated target or holder.

`encounter` - the encounter itself

`side` - the side or sides designated by the `side` attribute. 

`self` - the entity that holds the `<target>` or `<holder>` element

`target` - the target of the `<effect>` or `<action>` element ultimately
holding the `<target>` or `<holder>` element. If the action has multiple
targets, all will be included. Effects created by an action with multiple
targets each have one target, i.e. one of the action's targets. `target`
is the default for the `<target>` element inside effects.

`holder` - the entity that holds the entity that holds the `<target>` or
`<holder>` element; the default for the `<holder>` element inside properties.

`holder2` - the second-order holder, i.e. the entity that holds the entity
that holds the entity that holds the `<target>` or `<holder>` element.

`holder3` - the third-order holder.

`ultimateHolder` - the last in the chain of entities (not the side) that hold
the next entities in the chain and ultimately hold the entity with the
`<target>` or `<holder>` element

`creator` - the entity that created the first entity with a creator in the
chain of entities that holds the `<target>` or `<holder>` element, starting
from the bottom up. For instance, if an _effect_ has a
`<target targetType="creator"></target>` element, and that _effect_ belongs
to a _trait_ that belongs to an _argument_ that was created by a _character_,
then the aforementioned _character_ will be picked as the target. Note that
_actions_ are created by _characters_ too.

`code` - the entities included in an array returned by the code contents of
the `<getTargetsCode>` child element belonging to the `<target>` or `<holder>`
element; the `<isTargetCode>` code element must also exist, see below.

`kindredActions` - all actions created by the same `creator` as the entity
holding the `<target>` or `<holder>` element. These may include the entity
itself or its holder.

`kindredArguments` - all arguments created by the same `creator` as the entity
holding the `<target>` or `<holder>` element. These may include the entity
itself or its holder.

`kindredBoosters` - all boosters created by the same `creator` as the entity
holding the `<target>` or `<holder>` element. These may include the entity
itself or its holder.

`kindredCharacters` - all characters created by the same `creator` as the
entity holding the `<target>` or `<holder>` element. These may include the
entity itself or its holder.

`kindredItems` - all items created by the same `creator` as the entity
holding the `<target>` or `<holder>` element. These may include the entity
itself or its holder.

`kindredTraits` - all traits created by the same `creator` as the entity
holding the `<target>` or `<holder>` element. These may include the entity
itself or its holder.

`sameHolderBoosters` - all boosters that share the same argument as either the
entity holding the `<target>` or `<holder>` element or the closest entity
to it in its chain of holders.

`sameHolderEffects` - all effects that share the same holder as either the
entity holding the `<target>` or `<holder>` element or, if that entity is
a property, its holder.

`sameHolderItems` - all items that share the same character as either the
entity holding the `<target>` or `<holder>` element or the closest entity to
it in its chain of holders.

`sameHolderEquippedItems` - all equipped items that share the same character
as either the entity holding the `<target>` or `<holder>` element or the
closest entity to it in its chain of holders.

`sameHolderTraits` - all traits that share the same `holder` as either the
entity holding the `<target>` or `<holder>` element or the closest entity to
it in its chain of holders.

`allDevelopers` - all developers of the argument that ultimately holds the
`<target>` or `<holder>` element

`allActions` - all (unfinished) actions on the specified `side`

`allArguments` - all arguments on the specified `side`

`allBoosters` - all boosters on the specified `side`

`allGlobalBoosters` - all global boosters on the specified `side`

`allArgumentBoosters` - all boosters that affect an argument on the
specified `side`

`allFriendlyBoosters` - all boosters created by entities on arguments of
their own side

`allAdverseBoosters` - all boosters created by entities on arguments of
the opposing side

`allCharacters` - all characters on the specified `side`

`allEffects` - all effects belonging to entities on the specified `side`

`allItems` - all items on the specified `side`

`allEquippedItems` - all items equipped by characters on the specified `side`

`allTraits` - all traits on the specified `side`

`allArgumentTraits` - all traits belonging to characters on the specified
`side`

`allCharacterTraits` - all traits belonging to characters on the specified
`side`

`allEncounterTraits` - all traits belonging to the encounter

`allItemTraits` - all traits belonging to items on the specified `side`

Note that irrespective of the targetType, the target or holder list is
still filtered by the other attributes of the `<target>` or `<holder>`
element, so a `<holder side="opposing" targetType="creator"></holder>`
element will only find a holder if the creator of the `<holder>` element's
parent entity is on the opposite side, which is highly unlikely to happen in
any ruleset. Likewise, 
`<target side="1" active="true" targetType="allCharacters"></target>` will
only target all active characters on side 1. The `encounter` and
`allEncounterTraits` target types ignore sides.


### Trait


A `<trait>` tag placed in the top level (i.e. right under the `<ruleset>`
tag) describes a trait _kind_, not an individual trait. By contrast,
a `<trait>` tag placed inside another entity tag describes an
individual trait.




A trait kind has a **target** attribute



`trait`, `trait-character`, `trait-argument` and `trait-encounter` classes




### Visibility
The visibility rules that determine which aspects of an encounter's
characters, arguments, boosters and traits need to be discovered and
which are known from the beginning can be found here. The `<visibility>`
element, which stores these rules, may be placed either directly inside a
`<ruleset>` element, in which case it affects all encounter kinds, or
directly inside an `<encounter>` element, in which case it affects only
the specified encounter kind. Note that the rules specified in a given
`<encounter>` take precedence over the rules specified in the `<ruleset>`.
If the visibility rules stated in the `<encounter>` are incomplete, they
will be supplemented but not overwritten by the visibility rules stated in
the `<ruleset>`.

To disable visibility rules altogether and make everything visible, simply
put the following in your `<ruleset>`:
```
<visibility
	allVisible="true"
></visibility>
```
This will override all visibility rules inside all elements, so it can be
used to quickly mod away the visibility rules for a whole game. Any new
top-level (i.e. child of the `<ruleset>` element) visibility rules after
this one will override the `allVisible="true"` attribute, however, so
unless they themselves contain it, it will no longer take effect.

By default, the social encounter engine uses a rule whereby a propery
called **probing** is present in each argument, booster, character and
encounter, and determines when its various traits are revealed. Various
effects can increase the probing property, and when it exceeds a
**secrecy** property specific to each entity, knowledge about that entity
is revealed to the probing side.

You can override the default probing rules by putting
**overrideDefaultProbing="true"** into your top-level `<visibility>` rule.
This will make normal probing no longer work, and prevent the normal
`probing` and `secrecy` properties from being loaded into game entities.
Simply do:
```
<visibility
	overrideDefaultProbing="true"
></visibility>
```
You can re-enable default probing in later top-level (but only top-level)
`<visibility>` rules.

Each child element within the `<visibility>` element can have a **class**
attribute included in it, like so:
```
<visibility>
	<encounter class="class-1, class-2">
	</encounter>
</visibility>
```
In the example given, this establishes that only encounter kinds that have
all the above classes are affected by this visibility rule. If an id
attribute is specified, it will override the class attribute.

Note that the visibility rules are set in stone once the encounter starts;
adding extra classes to an entity will not make that entity subject to
different visibility rules than it started out with. There are, however,
ways to make an entity's visibility change within an encounter. TODO

Each element can likewise have an **id** attribute included in it, like so:
```
<visibility>
	<argument id="argument-refutation">
	</argument>
</visibility>
```
In the example given, this establishes that only the argument kind with
the specified id has the specified visibility rules.

The `<visibility>` rule itself or any of its child rules can have a 
**mode** attribute which works identically to the mode attributes of
entity rules, see the [Ruleset Xml](#ruleset-xml) section for details.
The child nodes of the `<visibility>` tag may have their own mode attributes,
in which case they affect previous instances with the same id and class
list.

Inside the `<visibility>` element, there are rules for the overall
encounter (placed in the `<encounter>` element), rules for various
character kinds (placed in the `<character>` element) etc. Although the tag
says 'character' and not 'characters', a single `<character>` element
can describe the visibility rules for the character kinds whose classes
are specified in its `class` attribute, and for all character kinds in the
ruleset if no `class` or `id` attribute is specified; likewise for all
other children of the `<visibility>` element.

All attributes for the rules below, with the exception of `id` and `class`,
may be set to either `true` or `false`. The following elements can exist:

`<encounter>` - has a **properties**, a **traits** and a **secrets**
attribute, describing whether the encounter's properties, traits and
secrets (and only its own) are visible. In addition, the encounter has a
set of **\*Refresh** attributes, e.g. **propertiesRefresh** and
**traitsRefresh**, that determine whether the visibility status of these
should be refreshed to the value of the corresponding `properties`,
`traits` etc.

The default settings, which need not be typed in, are:
```
<encounter
	properties="false"
	propertiesRefresh="false"
	traits="true"
	traitsRefresh="false"
	secrets="false"
	secretsRefresh="false"
></encounter>
```

`<character>` - has the following:

* an **action** attribute that describes whether the character's action will
be visible once it is performed by the opposing side or the neutral side,

* an **actionToMySide** attribute that describes whether the action will be
visible when performed towards the player's side or any argument or
character on the player's side, by someone on another side having this rule

* an **actionBuildup** attribute that determines whether the character's
action will be visible while it is being created, if the action takes
multiple turns to carry out before being completed.

* a **properties** attribute that describes whether the character's
properties are visible

* an **identity** attribute that describes whether the character's identity
(i.e. name, picture and/or whatever else your game implements) is known

* a **kind** attribute that describes whether the character's kind is known

* a **traits** attribute that describes whether the character's traits
are known

* a **secrets** attribute that auto-reveals the character's secrets at the
start of the encounter if set to `true`.

In addition, the `<character>` element features `*Refresh` attributes
(`actionBuildupRefresh`, `propertiesRefresh`, `identityRefresh`,
`kindRefresh`, `traitsRefresh` and `secretsRefresh` that denotes whether
the visibility status of these should be refreshed to the value of the
corresponding `action`, `properties` etc. attribute every turn.

The default settings, which need not be typed in, are:
```
<character
	action="true"
	actionToMySide="true"
	actionBuildup="false"
	actionBuildupRefresh="true"
	properties="false"
	propertiesRefresh="false"
	identity="true"
	identityRefresh="false"
	kind="true"
	kindRefresh="false"
	traits="false"
	traitsRefresh="false"
	secrets="false"
	secretsRefresh="false"
></character>
```

`<argument>` and `<booster>` - have a **properties** attribute that
describes whether the argument or booster's properties are visible
and a **kind** setting, determining whether the argument or booster's kind
is known. `<argument>` also has a **traits** attribute denoting the
visibility of argument traits. In addition, `<argument>` and `<booster>`
have a **propertiesRefresh** and a **kindRefresh** attribute, while 
`<argument>` has a **traitsRefresh** attribute, denoting whether the
visibility of the argument or booster's properties, traits or kind will be
refreshed each turn to the value specified in the respective 'properties'
and 'kind' attribute.

The default settings, which need not be typed in, are:
```
<argument
	properties="false"
	propertiesRefresh="false"
	traits="false"
	traitsRefresh="false"
	kind="true"
	kindRefresh="false"
>
</argument>
<booster
	properties="false"
	propertiesRefresh="false"
	kind="false"
	kindRefresh="false"
>
</booster>
```

`<item>` TODO




`<trait>` - has a **trait** attribute that determines whether the
trait itself is visible, and a **traitRefresh** attribute that determines
whether the trait's visibility refreshes to its default value each turn.

The default settings, which need not be typed in, are:
```
<trait
	trait="false"
	traitRefresh="false"
></trait>
```

`<property>` - placed within a `<visibility>` element, holds rules for
properties that are not specific to certain kinds of characters, boosters
etc. `<property>` elements can store an **id** attribute and a **class**
attribute, denoting the id or classes of the properties they affect.
They also have a **vis** attribute that can be set to `true` or `false` and
denotes whether the property or properties affected by this rule are
initially visible, an **alwaysHide** attribute that tells the default probing
process whether to never reveal this property, and a **refresh** attribute
that determines whether the property's hidden or visible status will be
reset to the value stored in `vis` every turn. By default, `vis` is `false`, 
alwaysHide is `false` and `refresh` is `false`.

Keep in mind that all these child elements of `<visibility>` can have
optional `id` and `class` attributes to narrow down the list of entity
kinds whose visibility they describe. You can have multiple elements of the
same type in your `<visibility>` rule, for example:
```
<visibility>
	<argument
		class="argument-hostile"
		properties="false"
	></argument>
	<argument
		class="argument-peaceful"
		properties="true"
	></argument>
</visibility>
```

In addition, all children of `<visibility>` with the exception of `<trait>`
and `<property>` can store additional `<property>` elements, which
determine whether specific properties of theirs will be visible. Inside
one of `<visibility>`'s children, e.g. inside `<character>`, Simply write:
```
<property
	id="property-conviction"
	vis="false"
	refresh="true"
></property>
```
This will make the 'conviction' property visible at the start of the
encounter. 

The contents of top-level `<property>` elements will be overriden by the
`<property>` elements inside individual `<argument>`, `<character>` etc.
elements that are children of `<visibility>`, but will override the
`properties` _attribute_ of these `<argument>` etc. elements.

Individual action kinds, character kinds, argument kinds and booster kinds
may have `<visibility>` elements of their own, which contain the same
attributes as the `<visibility><character>`, `<visibility><argument>` and
`<visibility><booster>` rules. For instance, we can have: 

```
<argument id="argument-refutation">
	<visibility
		properties="true"
		traits="true"	
	></visibility>
</argument>
```
This will make the properties and traits of `argument-refutation` arguments
visible by default.

In addition, action kinds can have `<visibility>` elements that contain an
**action**, **actionToMySide**, **actionBuildup** and
**actionBuildupRefresh** attribute, just like `<character>` elements do.
The contents of an action kind's `<visibility>` override all other rules
concerning the visibility of that action kind.

For example:
```
<action id="action-explain">
	<visibility
		action="false"
		actionToMySide="true"
	></visibility>
</action>
```

`<visibility>` rules within individual argument, booster etc. kinds will
always override the top-level `<visibility>` rules.

Trait kinds can have a `<visibility>` rule containing a `trait` attribute
and a `traitRefresh` attribute, like so:
```
<trait>
	<visibility
		trait="true"
		traitRefresh="false"
	></visibility>
</trait>
```

The `<visibility>` elements found inside action kinds, argument kinds etc.
may not include any child elements of their own besides `<property>`,
which is described above.

