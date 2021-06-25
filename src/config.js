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

// Menu and title screen graphics
cfg.ui.title = {};
cfg.ui.title.width = 790;
cfg.ui.title.height = 96;
cfg.ui.title.marginHeight = 24;

cfg.ui.quotePanel = {};
cfg.ui.quotePanel.marginHeight = 32; //used in the portrait orientation

cfg.ui.quote = {};
cfg.ui.quote.marginWidth = 64;
cfg.ui.quote.marginHeight = 64;
cfg.ui.quote.wrapWidth = cfg.ui.fonts.cursive.size * 20;
cfg.ui.quote.innerMargin = 16;

cfg.ui.menu = {};
cfg.ui.menu.marginWidth = 32;
cfg.ui.menu.marginHeight = 32;

cfg.ui.menuItem = {};
cfg.ui.menuItem.width = 320;
cfg.ui.menuItem.height = 56;
cfg.ui.menuItem.marginHeight = 6;

cfg.ui.textButton = {};

// Text button frames, i.e. the actual frames in the text button image
cfg.ui.textButton.frameBase = 0;
cfg.ui.textButton.framePressed = 1;
cfg.ui.textButton.frameHover = 2;
cfg.ui.textButton.frameDisabled = 3;

cfg.ui.textButton.hoverTweenDuration = 500;
cfg.ui.textButton.pressedTweenDuration = 100;
cfg.ui.textButton.disabledTweenDuration = 500;
cfg.ui.textButton.textTweenDuration = 300;

export default cfg;
