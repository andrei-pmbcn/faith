TODO 'default' attribute to all entity kinds
TODO modifiers - an effect that targets another effect
TODO effect initiative (set initiative 300 for additive, initiative 400 for
multiplicative, initiative 100 for interrupt effects that are additive,
initiative 200 for interrupt effects that are multiplicative etc);
TODO encounter visibilities (whether characters' actions are known, 
 etc.)
TODO prop.side1, prop.side2, prop.side0 - the value of that property
related to a given side; e.g. research.side1 and (for neutral characters)
probing.side1 and conviction.side1. Effects also have a "propSide" element
that determines whether to affect 'side1', 'side2' , 'side0' (absolute),
the 'opponent' side or the 'friendly' side (relative).
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
encounters in XML and load them into the engine, then run an encounter,
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

## Running your own game
If you just want to mod or create campaigns / scenarios for an already
existing game that uses this engine, skip this section.

You can use the rules that come packaged with this module or create the
rules for your own RPG by specifying them in an XML file or files,
XML strings or XML documents. You can also modify the rules that come
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
The social encounter engine uses [XML](https://www.w3schools.com/xml/) for
writing its rulesets and individual encounters. You write your text files
in XML and pass them on to the engine for processing. XML is easy to use
and can be learned quickly. In summary, XML consists of 'elements', each of
which comprises a pair of 'tags' (the opening and closing tags) and
everything contained between them, so an empty element called myElement
would look like:
```
<myElement></myElement>
```
Note the slash at the start of the closing tag, which marks it as a closing
tag.

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
	<!-- XML is easy! -->
</myElement>
```

You should use an XML editor or some other program to proofread
your XML file, because the engine uses an external parser for converting
the XML text into a tree structure, and that parser doesn't create error
messages that show you where in the text file your error is. However, the
errors that come up when converting that tree structure into a ruleset or
encounter, errors that are specific to the Social Encounter Engine, will
have detailed error messages showing you where the problem is in your file.

[TODO]









Tips for developers:
* Test every little rule after you write it. Don't write huge blocks of
rules and test them later (or not at all), because you _will_ run into
errors.



## Ruleset XML
This chapter describes the XML elements that make up
the rules of a ruleset, which must encompass all the rules for a given
type of social encounter. There is usually one ruleset per game.

The ruleset object loads the rules from xml files or strings that contain
`<ruleset></ruleset>` tags.

Each XML rule must be part of a ruleset, being included in the
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
rule's basic entity_ (`action`, `argument`, `character` etc.) written at
the beginning of the id, e.g. `'action-explain'`, but in the case of a
rule for a condition, effect, cost or modifier that is not a top-level
rule, the id can be a number, in which case the social encounter engine's
XML parser converts this number into a string that contains the id of the
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
id.

All top-level rules, i.e. rules that are the direct children of a 
`<ruleset>` tag, must have a string id; likewise, `<action>`, `<argument>`,
`<booster>`, `<character>`, `<encounter>` and `<trait>` rules must have an
id no matter where they are in the XML tree. Top-level `<...Condition>`, 
`<cost>` and `<effect>` rules are considered templates that are copied
into other rules of their kind, so they must also have string ids.

Each rule within the ruleset may have a list of comma-separated classes as
an attribute. These classes are text labels meant to group different rules
together and allow actions, conditions and effects to target them
specifically. For instance, an action `action-neutralize` may only target
adverse boosters (which have negative effects), and identify these boosters
because they have the class `adverse`. You can put in whatever classes you
believe you need for your ruleset, or none at all.

Example of classes:
```
<argument class="conviction-increasing, low-cost">
	...
</argument>
```

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

`<maxOccurencesPerTurn>` - the maximum number of times the effect will
occur each turn.
`<maxOccurences>` - the maximum number of times the effect will occur.
After this number is reached, the effect will be destroyed.







### Encounter
The <encounter></encounter> element describes a given kind of encounter that
will be available, storing the encounter kind's visibility rules, its
victory conditions and any rules for what kinds of actions, arguments etc.
are specific to the encounter. All encounter kinds have the 'encounter'
class.

The encounter must have an **id** attribute and can have a **class**,
**mode**, **template** and **default** attribute. See the
[Ruleset XML](#ruleset-xml) section for more information.

The encounter can have two (and only two) `<victory>` elements, which
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
`<copyById>` - copies the contents of another `<encounter>` elements into
this `<encounter>` element before processing any of this element's
children.

`<removeClass>` - when using `mode="alter"`, this allows you to remove a
class from the encounter. All classes specified in the encounter's
`class` attribute are actually added to the encounter itself.

`<visibility>` - the encounter's visibility rules. See the
[visibility](#visibility) section for more information.

`<property>` - any property specific to the encounter itself. See the 
[Property](#property) section for more information.

TODO


### Property


Attributes:






### Trait

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
If the visibility rules stated in the <encounter> are incomplete, they
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
**overrideDefaultProbing="true"** into your top-level <visibility> rule.
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

Each child element within the `<visibility>` element can have a class
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

Each element can likewise have an id attribute included in it, like so:
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
entity rules, see the [Ruleset XML](#ruleset-xml) section for details.
The child nodes of the <visibility> tag may have their own mode attributes,
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
initially visible, and a **refresh** attribute that determines whether the
property's hidden or visible status will be reset to the value stored in
`vis` every turn. By default, `vis` is `false` and `refresh` is `false`.

Keep in mind that all these child elements of `<visibility>` can have
optional `id` and `class` attributes to narrow down the list of entity
kinds whose visibility they describe. You can have multiple elements of the
same type in your `<visibility>` rule, for example:
```
<visibility>
	<argument
		class="hostile"
		properties="false"
	></argument>
	<argument
		class="peaceful"
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

