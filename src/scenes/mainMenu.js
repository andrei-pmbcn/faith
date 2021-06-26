/*
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

// class and script imports
import FaithScene from './scene.js';
import TextButton from '../gameobj/button.js';
import Panel from '../gameobj/panel.js';
import cfg from '../config.js';

// image imports
import imgMenuTile from '../assets/graphics/ui/menu_tile.png';
import imgGameTitle from '../assets/graphics/ui/game_title.png';
import imgTextButton from '../assets/graphics/ui/text_button_large.png';
import imgPanelCornerShadow from '../assets/graphics/ui/panel_corner_shadow.png';
import imgPanelTile from '../assets/graphics/ui/panel_tile.png';
import imgPanelTileDisabled from '../assets/graphics/ui/panel_tile_disabled.png';
import imgPanelBorder from '../assets/graphics/ui/panel_border.png';

// font imports
import fntpngBlock from '../assets/graphics/fonts/Ubuntu-BoldWhite.png';
import fntxmlBlock from '../assets/graphics/fonts/Ubuntu-BoldWhite.xml';
import fntCallig from '../assets/graphics/fonts/Blenda_Script.otf';
import fntpngCallig from '../assets/graphics/fonts/Blenda.png';
import fntxmlCallig from '../assets/graphics/fonts/Blenda.xml';

// sound imports [TODO]

// data imports
import xmlQuotes from '../assets/xml/quotes.xml';


//[TODO] Test scaling at different resolutions for button and panel

/**
 * The main menu scene for Faith of the Apostles
 *
 * @extends FaithScene
 */
export default class MainMenu extends FaithScene
{
    constructor()
    {
        super();
    }

    preload()
    {
		super.preload();

		if (!this.textures.exists('title')) {
	        this.load.image('title', imgGameTitle);
		}

		if (!this.textures.exists('menu-tile')) {
			this.load.image('menu-tile', imgMenuTile);
		}		

		if (!this.textures.exists('text-button')) {
			this.load.spritesheet('text-button', imgTextButton,
				{ frameWidth: cfg.ui.textButton.largeWidth, frameHeight: cfg.ui.textButton.largeHeight },
			);
		}

		if (!this.textures.exists('panel-tile')) {
			this.load.image('panel-tile', imgPanelTile);
		}

		if (!this.textures.exists('panel-tile-disabled')) {
			this.load.image('panel-tile-disabled', imgPanelTileDisabled);
		}

		if (!this.textures.exists('panel-corner-shadow')) {
			this.load.image('panel-corner-shadow', imgPanelCornerShadow);
		}

		if (!this.textures.exists('panel-border')) {
			this.load.spritesheet('panel-border', imgPanelBorder,
				{ frameWidth: cfg.ui.panel.pieceWidth, frameHeight: cfg.ui.panel.pieceHeight }
			);
		}

		if (!this.textures.exists('button-BMF')) {
			this.load.bitmapFont('button-BMF', fntpngBlock, fntxmlBlock);
		}		

		if (!this.textures.exists('faith-callig-BMF')) {
			this.load.bitmapFont('faith-callig-BMF', fntpngCallig, fntxmlCallig);
		}

		// Use an XMLHttpRequest to extract the quotes from the URL
		let quoteRequest = new XMLHttpRequest();
		quoteRequest.open('GET', xmlQuotes);
		quoteRequest.send();
		quoteRequest.onload = function() {
			this.quotes = quoteRequest.responseXML.firstChild.children;
			this._pickQuote();
		}.bind(this);

		//[TODO] complete loading screen
    }
      
    async create()
    {
		super.create();

		this.events.on('wake', this.handleWake);

		// create the background
		this.background = this.add.tileSprite(
			this.scale.width / 2, this.scale.height / 2,
			this.scale.width, this.scale.height,
			'menu-tile'
		);
		this.background.setName('background');

		// create the game title
        this.title = this.add.image(
			this.scale.width / 2,
			cfg.ui.title.height / 2 + cfg.ui.title.marginHeight,
			'title'
		);
		this.title.setName('title');

		//[TODO] check if the font has already been loaded before loading it
		let calligFont = new FontFace('faith-callig', `url(${fntCallig})`);
		
		await calligFont.load(); 
			document.fonts.add(calligFont);

		let panelCenterX, panelCenterY;

		if (this.scale.width > this.scale.height) {
			// we are in landscape mode
			panelCenterX = (this.scale.width + cfg.ui.menu.marginWidth + cfg.ui.textButton.largeWidth) / 2;
			panelCenterY = (this.scale.height + cfg.ui.title.height + cfg.ui.title.marginHeight) / 2;
		} else {
			// we are in portrait mode
			panelCenterX = this.scale.width / 2;
			panelCenterY = cfg.ui.title.marginHeight * 2 + cfg.ui.title.height
				+ cfg.ui.quotePanel.marginHeight
				+ (cfg.ui.quotePanel.paddingHeight * 2 + cfg.ui.quotePanel.textHeight) / 2;
		}

		this.quotePanel = new Panel(this,
			panelCenterX,
			panelCenterY,
			cfg.ui.quotePanel.paddingWidth * 2 + cfg.ui.quotePanel.wrapWidth,
			cfg.ui.quotePanel.paddingHeight * 2 + cfg.ui.quotePanel.textHeight
		);

		this.quoteContent = this.add.text(panelCenterX, panelCenterY, '')
			.setFontFamily('faith-callig')
			.setColor('black')
			.setFontSize(cfg.ui.fonts.cursive.size)
			.setAlign('center')
			.setWordWrapWidth(cfg.ui.quotePanel.wrapWidth)
			.setOrigin(0.5, 0.5)
			.setName('quote-content');
		this.quotePanel.contents.push(this.quoteContent);

		this.quoteReference = this.add.bitmapText(panelCenterX, panelCenterY, 'faith-callig-BMF')
			.setOrigin(0.5, 0.5)
			.setName('quote-reference');
		this.quotePanel.contents.push(this.quoteReference);

		this._pickQuote();

		// create the menu items
		this.menuButtons = [];

		// we start from the main menu, not a submenu
		this.data.set('submenu', 'none');

		for (let k = 0; k <= 5; k++) {
			let button = new TextButton(this);
			this.menuButtons.push(button);
		}

		let resizeEvent =  this.handleResize.bind(this);
		window.addEventListener('resize', resizeEvent);
		this.events.on('destroy', function() { window.removeEventListener(resizeEvent) });

		//position all UI elements
		this.handleResize();

		// put text in the menu items' textboxes
		this.assignMenuButtons(true);
    }

	/*
	* @method assignMenuButtons
	* Assign text to the menu buttons, set their frames (greying out disabled buttons etc)
	* and assign the functions they will call when clicked
	* 
	* @param {boolean} areNamesInstant - whether the buttons instantly receive their new names
	*/
	assignMenuButtons(areNamesInstant = false)
	{
		// replace the entries in the following arrays as needed in your submenu

		// the button frames, which should indicate here whether or not the buttons are disabled
		let disabled = [false, false, false, false, false, false];

		// the text on the buttons
		let names = ['', '', '', '', '', ''];

		// the functions called when clicking the buttons
		let actions = [null, null, null, null, null, null];

		// configure the buttons
		switch(this.data.get('submenu')) {
			case 'none':
				if (this.registry.get('isLoggedIn') === false) {
					names[0] = 'Login / register';
				} else {
					names[0] = 'Logout';
				}
				names[1] = 'Extras';
				names[2] = 'Options';
				names[3] = 'Tutorial';
				names[4] = 'Load Game';
				names[5] = 'New Game';

				actions[3] = this.runTutorial;
				actions[4] = this._runLoadGame;
				actions[5] = this._runNewGame;
				break;
			case 'new':
				disabled[0] = true;

				names = ['', 'Back', 'Extra Vignettes',
					'Extra Campaigns', 'Official Vignettes', 'Official Campaigns'];

				actions[1] = this._runBackToMain;
				break;
			case 'load':
				disabled[0] = true;
				disabled[1] = true;
				disabled[2] = true;

				names = ['', '', '', 'Back', 'Load From File', 'Load From Server'];

				actions[3] = this._runBackToMain;
				break;
			default:
				throw "invalid submenu for the main menu in mainMenu.js";
		}

		// update the buttons
		for (let k = 0; k < 6; k++) {
			let button = this.menuButtons[k];

			// reset the button item's events
			if (disabled[k] === true) {
				button.action = this.menuButtons[k].disabledAction;
				if (!button.isDisabled) {
					button.disable();
				}
			} else {
				if (actions[k] !== null) {
					button.action = actions[k];
				}
				if (button.isDisabled) {
					button.enable();
				}
			}

			// set the button text's new contents
				if (areNamesInstant) {
				button.setText(names[k]);
			} else {
				button.tweenText(names[k]);
			}
		}
	}

	/*
	* the scene's callback for the window resize event, which adjusts the scene to fit the new portrait
	* or landscape resolution
	*/
	handleResize() {
		super.handleResize();

		let sf = this.data.get('scalingFactor');

			//sf was set by the handleResize method of the FaithScene class

		// the background will be the same irrespective of whether
		// the window is in portrait or landscape mode

		// the background covers the entire game area
		this.background.setSize(this.scale.width, this.scale.height);
		this.background.setX(this.scale.width / 2);
		this.background.setY(this.scale.height / 2);

		// the title goes at the top-center of the screen
		this.title.setX(this.scale.width / 2);
		this.title.setY(cfg.ui.title.height / 2 * sf + cfg.ui.title.marginHeight * sf);

		if (this.scale.width > this.scale.height) {
			//we are in landscape mode
			this.title.setScale(sf);
				// (the title's scale is the same as the scene's in landscape mode)

			// place the bible quote on the bottom-right side of the window

			this.quotePanel.setScale(sf, true);
			this.quotePanel.setPosition(
				this.scale.width / 2 + (cfg.ui.menu.marginWidth + cfg.ui.textButton.largeWidth) / 2 * sf,
				this.scale.height / 2 + (cfg.ui.title.height + cfg.ui.title.marginHeight) / 2 * sf,
			);

			// place the menu items on the bottom-left side of the window
			for (let k = 0; k < 6; k++) {
				let button = this.menuButtons[k];

				button.setScale(sf);

				// all menu items go in the bottom-left corner
				let buttonX = cfg.ui.menu.marginWidth + cfg.ui.textButton.largeWidth / 2 * sf;
				let buttonY = this.scale.height
					- cfg.ui.menu.marginHeight
					- cfg.ui.textButton.largeHeight / 2 * sf
					- k * cfg.ui.textButton.largeHeight * sf
					- (2 * k + 1) * cfg.ui.menu.itemMarginHeight * sf;

				button.setPosition(buttonX, buttonY);
			}
		} else {
			// we are in portrait mode
			this.title.setScale(sf * 0.8);
				// because the width of the title is greater than the default screen width in
				// portrait mode, scale it by a further 0.8

			// place the bible quote in the center of the window
			this.quotePanel.setScale(sf, true);
			this.quotePanel.setPosition(
				this.scale.width / 2,
				(cfg.ui.title.marginHeight * 2 + cfg.ui.title.height
				+ cfg.ui.quotePanel.marginHeight
				+ (cfg.ui.quotePanel.paddingHeight * 2 + cfg.ui.quotePanel.textHeight) / 2) * sf,
			);

			// place the menu items on the bottom-center side of the window
			for (let k = 0; k < 6; k++) {
				let button = this.menuButtons[k];

				button.setScale(sf);

				// the height of the rest of the items, besides the menu
				let restHeight = (2 * cfg.ui.title.marginHeight + cfg.ui.title.height
					+ 2 * cfg.ui.quotePanel.marginHeight + 2 * cfg.ui.quotePanel.paddingHeight
					+ cfg.ui.quotePanel.textHeight) * sf;
				let menuHeight = (6 * cfg.ui.textButton.largeHeight + 12 * cfg.ui.menu.itemMarginHeight) * sf;
				let menuBase = (this.scale.height + restHeight + menuHeight) / 2

				let buttonX = this.scale.width / 2;
				let buttonY = menuBase
					- cfg.ui.menu.marginHeight * sf
					- k * cfg.ui.textButton.largeHeight * sf
					- (2 * k + 1) * cfg.ui.menu.itemMarginHeight * sf;

				button.setPosition(buttonX, buttonY);
			}
		}
	}

	handleWake() {
		this._pickQuote();
	}

	_pickQuote() {
		if (!this.scene.isActive(this))
			return;

		// _pickQuote may have been called before create() finished
		if (this.quoteContent && this.quoteReference) {
			let kQuote = this.data.get('kQuote');
			let roll = Math.floor(Math.random() * this.quotes.length);

			if (kQuote !== undefined) {
				if (roll === kQuote) {
					if (roll === this.quotes.length - 1) {
						roll = 0;
					} else {
						roll = kQuote + 1;
					}
				}
			}
			kQuote = roll;

			let content, reference;
			if (this.quotes[kQuote].children[0].nodeName === 'content') {
				content = this.quotes[kQuote].children[0].textContent;
				reference = this.quotes[kQuote].children[1].textContent;
			} else {
				content = this.quotes[kQuote].children[1].textContent;
				reference = this.quotes[kQuote].children[0].textContent;
			}

			console.log('bp1');
			// render the quote invisible
			let tween = this.add.tween({
				targets: [this.quoteContent, this.quoteReference],
				alpha: 0.0,
				ease: 'Power2',
				duration: cfg.ui.quotePanel.tweenDuration,
			})
			tween.setCallback('onComplete', function() {
				console.log('bp2');

				// set the quote's text
				this.quoteContent.setText(content);
				this.quoteReference.setText(reference);

				// set the quote's position
				let sf = this.data.get('scalingFactor');

				// treat the quote content, the quote reference and the margin between
				// them as a block
				let blockHeight = (this.quoteContent.height + this.quoteReference.height
					+ cfg.ui.quotePanel.innerMargin) * sf;
				
				let emptyArea = (this.quotePanel.baseHeight * sf - blockHeight) / 2;
					// (there will be two empty areas in the panel, equal in size,
					// hence the division by 2)

				let quoteContentY = this.quotePanel.y - this.quotePanel.baseHeight / 2 * sf
					+ emptyArea + this.quoteContent.height / 2 * sf;

				let quoteReferenceY = this.quotePanel.y - this.quotePanel.baseHeight / 2 * sf
					+ emptyArea + (this.quoteContent.height 
					+ cfg.ui.quotePanel.innerMargin + this.quoteReference.height) * sf

				console.log(blockHeight, emptyArea, quoteContentY, quoteReferenceY);

				this.quoteContent.setPosition(this.quotePanel.x, quoteContentY);
				this.quoteReference.setPosition(
					this.quotePanel.x + cfg.ui.quotePanel.referenceXOffset,
					quoteReferenceY);

				// show the quote again
				this.add.tween({
					targets: [this.quoteContent, this.quoteReference],
					alpha: 1.0,
					ease: 'Power2',
					duration: cfg.ui.quotePanel.tweenDuration,
				});
			}.bind(this), []);

			setTimeout(this._pickQuote.bind(this), cfg.ui.quotePanel.newQuoteInterval);
		} else {
			setTimeout(this._pickQuote.bind(this), 1000);
		}

	}

	_runTutorial() {
		

		
	}

	_runNewGame() {
		this.scene.data.set('submenu', 'new');
		this.scene.assignMenuButtons();
	}

	_runLoadGame() {
		this.scene.data.set('submenu', 'load');
		this.scene.assignMenuButtons();
	}

	_runBackToMain() {
		this.scene.data.set('submenu', 'none');
		this.scene.assignMenuButtons();
	}

}

