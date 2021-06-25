// class and script imports
import FaithScene from './scene.js';
import TextButton from '../gameobj/button.js';
import cfg from '../config.js';

// image imports
import imgMenuTile from '../assets/graphics/ui/menu_tile.png';
import imgGameTitle from '../assets/graphics/ui/game_title.png';
import imgTextButton from '../assets/graphics/ui/text_button_large.png';

// font imports
import fntpngBlock from '../assets/graphics/fonts/Ubuntu-BoldWhite.png';
import fntxmlBlock from '../assets/graphics/fonts/Ubuntu-BoldWhite.xml';
import fntCallig from '../assets/graphics/fonts/Blenda_Script.otf';
import fntpngCallig from '../assets/graphics/fonts/Blenda.png';
import fntxmlCallig from '../assets/graphics/fonts/Blenda.xml';

// sound imports [TODO]

//[TODO] Test scaling at different resolutions for button and panel

export default class MainMenu extends FaithScene
{
	//menuHeight = 6 * cfg.ui.menuItem.height + 12 * cfg.ui.menuItem.marginHeight;

    constructor()
    {
        super();
    }

    preload()
    {
		super.preload();

        this.load.image('title', imgGameTitle);
		//this.load.image('title', imgMenuTile); //[TODO] test this, see if it overwrites
		this.load.image('menu-tile', imgMenuTile);
		this.load.spritesheet('text-button',
			imgTextButton,
			{ frameWidth: cfg.ui.menuItem.width, frameHeight: cfg.ui.menuItem.height },
		);
		//[TODO] load the button image and font if not already loaded
		this.load.bitmapFont('button-BMF', fntpngBlock, fntxmlBlock);
		
		this.load.bitmapFont('Faith-Callig-BMF', fntpngCallig, fntxmlCallig);
		//[TODO] complete loading screen, possibly parent from a new class
		// that handles the loading screen
    }
      
    async create()
    {
		super.create();

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

		let calligFont = new FontFace('Faith-Callig', `url(${fntCallig})`);
		
		await calligFont.load(); 
			document.fonts.add(calligFont);

		this.quoteContent = this.add.text(0.0, 0.0);
		this.quoteContent.setFontFamily('Faith-Callig');
		this.quoteContent.setColor('black');
		this.quoteContent.setFontSize(24);
		this.quoteContent.setAlign('center');
		this.quoteContent.setWordWrapWidth(cfg.ui.quote.wrapWidth);
		this.quoteContent.setName('quote-content');

		this.quoteReference = this.add.bitmapText(0.0, 0.0, 'Faith-Callig-BMF');
		this.quoteReference.setName('quote-reference');

		this.quoteReference.setText('--Ephesians 6:12');

		this.quoteContent.setText(
			'For our struggle is not against flesh and blood, but against the rulers,'
			+ ' against the authorities, against the powers of this dark world and '
			+ 'against the spiritual forces of evil in the heavenly realms.');

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
				actions[4] = this.runLoadGame;
				actions[5] = this.runNewGame;
				break;
			case 'new':
				disabled[0] = true;

				names = ['', 'Back', 'Extra Vignettes',
					'Extra Campaigns', 'Official Vignettes', 'Official Campaigns'];

				actions[1] = this.runBackToMain;
				break;
			case 'load':
				disabled[0] = true;
				disabled[1] = true;
				disabled[2] = true;

				names = ['', '', '', 'Back', 'Load From File', 'Load From Server'];

				actions[3] = this.runBackToMain;
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

		// the background and title will be the same irrespective of whether
		// the window is in portrait or landscape mode

		// the background covers the entire game area
		this.background.setSize(this.scale.width, this.scale.height);
		this.background.setX(this.scale.width / 2);
		this.background.setY(this.scale.height / 2);

		// the title goes at the top-center of the screen
		this.title.setScale(sf);
		this.title.setX(this.scale.width / 2);
		this.title.setY(cfg.ui.title.height / 2 * sf + cfg.ui.title.marginHeight * sf);

		if (this.scale.width > this.scale.height) {
			//we are in landscape mode

			// place the bible quote on the bottom-right side of the window
			let quoteX = this.scale.width - cfg.ui.quote.marginWidth * sf;
			let quoteY = this.scale.height - cfg.ui.quote.marginHeight * sf;

			this.quoteContent.setScale(Math.max(0.75, sf)); //cap on scale to keep it legible
			this.quoteContent.setOrigin(1.0, 1.0);
			this.quoteContent.setPosition(quoteX, quoteY - cfg.ui.quote.innerMargin * sf, 0);

			this.quoteReference.setScale(Math.max(0.75, sf)); //cap on scale to keep it legible
			this.quoteReference.setOrigin(1.0, 1.0);
			this.quoteReference.setPosition(quoteX, quoteY, 0);
		
			// place the menu items on the bottom-left side of the window
			for (let k = 0; k < 6; k++) {
				let button = this.menuButtons[k];

				button.setScale(sf);

				// all menu items go in the bottom-left corner
				let buttonX = cfg.ui.menu.marginWidth + cfg.ui.menuItem.width / 2 * sf;
				let buttonY = this.scale.height
					- cfg.ui.menu.marginHeight
					- cfg.ui.menuItem.height / 2 * sf
					- k * cfg.ui.menuItem.height * sf
					- (2 * k + 1) * cfg.ui.menuItem.marginHeight * sf;

				button.setPosition(buttonX, buttonY);
			}
		} else {
			// we are in portrait mode

			// place the bible quote in the center of the window
			//let extraSpace = gameHeight - sf * (cfg.ui.title.height + 2 * cfg.ui.title.marginHeight
			//	+ 2 * )

			//[TODO] placeholder coordinates, place in panel first
			let quoteX = this.scale.width / 2;
			let quoteY = this.scale.height / 2;

			this.quoteContent.setScale(Math.max(0.75, sf)); //cap on scale to keep it legible
			this.quoteContent.setOrigin(1.0, 1.0);
			this.quoteContent.setPosition(quoteX, quoteY - cfg.ui.quote.innerMargin * sf, 0);

			this.quoteReference.setScale(Math.max(0.75, sf)); //cap on scale to keep it legible
			this.quoteReference.setOrigin(1.0, 1.0);
			this.quoteReference.setPosition(quoteX, quoteY, 0);

			// place the menu items on the bottom-center side of the window
			for (let k = 0; k < 6; k++) {
				let button = this.menuButtons[k];

				//[TODO]
				button.setScale(sf);

				let buttonX = this.scale.width / 2;
				let buttonY = this.scale.height
					- cfg.ui.menu.marginHeight * sf
					- k * cfg.ui.menuItem.height * sf
					- (2 * k + 1) * cfg.ui.menuItem.marginHeight * sf;

				button.setPosition(buttonX, buttonY);
			}
		}
	}

	runTutorial() {
		

		
	}

	runNewGame() {
		this.scene.data.set('submenu', 'new');
		this.scene.assignMenuButtons();
	}

	runLoadGame() {
		this.scene.data.set('submenu', 'load');
		this.scene.assignMenuButtons();
	}

	runBackToMain() {
		this.scene.data.set('submenu', 'none');
		this.scene.assignMenuButtons();
	}


}

