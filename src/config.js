/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/**
* Faith's global configuration object, containing the game's hard-wired
* configuration data, such as the sizes of user interface objects.
*
* @var Faith.cfg
*/
var cfg = {};

cfg.defaultGameWidth = 1280;
cfg.defaultGameHeight = 720;
	// the default resolution should always be in ladscape mode

cfg.ui = {};

// Fonts
cfg.ui.fonts = {};

cfg.ui.fonts.cursive = {};
cfg.ui.fonts.cursive.size = 24;

cfg.ui.fonts.block = {}
cfg.ui.fonts.block.size = 24;

// *** Main Menu ***

// Menu and title screen graphics
cfg.ui.title = {};
cfg.ui.title.width = 790;
cfg.ui.title.height = 96;
cfg.ui.title.marginHeight = 24;

cfg.ui.quotePanel = {};
cfg.ui.quotePanel.marginHeight = 24;
cfg.ui.quotePanel.marginWidth = 24;
cfg.ui.quotePanel.paddingWidth = 64;
cfg.ui.quotePanel.paddingHeight = 64;
cfg.ui.quotePanel.fontSize = 28;
cfg.ui.quotePanel.wrapWidth = cfg.ui.quotePanel.fontSize * 20;
cfg.ui.quotePanel.textHeight = cfg.ui.quotePanel.fontSize * 10;
cfg.ui.quotePanel.innerMargin = 16;
	// (the space between the quote and its reference)
cfg.ui.quotePanel.timePerCharacter = 130; //in milliseconds
cfg.ui.quotePanel.tweenDuration = 1000;

cfg.ui.menu = {};
cfg.ui.menu.marginWidth = 32;
cfg.ui.menu.marginHeight = 32;
cfg.ui.menu.itemMarginHeight = 6;

cfg.ui.textButton = {};

cfg.ui.textButton.largeWidth = 320;
cfg.ui.textButton.largeHeight = 56;

// Text button frames, i.e. the actual frames in the text button image
cfg.ui.textButton.frameBase = 0;
cfg.ui.textButton.framePressed = 1;
cfg.ui.textButton.frameHover = 2;
cfg.ui.textButton.frameDisabled = 3;

cfg.ui.textButton.hoverTweenDuration = 600;
cfg.ui.textButton.pressedTweenDuration = 200;
cfg.ui.textButton.disabledTweenDuration = 600;
cfg.ui.textButton.textTweenDuration = 400;

cfg.ui.panel = {};

cfg.ui.panel.pieceWidth = 16;
cfg.ui.panel.pieceHeight = 16;

cfg.ui.panel.frameTopLeftCorner = 0;
cfg.ui.panel.frameVerticalEdge = 1;
cfg.ui.panel.frameHorizontalEdge = 2;
cfg.ui.panel.frameTopRightCorner = 3;
cfg.ui.panel.frameTopLeftCornerDisabled = 4;
cfg.ui.panel.frameVerticalEdgeDisabled = 5;
cfg.ui.panel.frameHorizontalEdgeDisabled = 6;
cfg.ui.panel.frameTopRightCornerDisabled = 7;
cfg.ui.panel.frameVerticalShadow = 9;
cfg.ui.panel.frameHorizontalShadow = 10;

cfg.ui.panel.disabledTweenDuration = 300;

export default cfg;
