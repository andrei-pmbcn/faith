// script imports
import cfg from './config.js';
import { pointOverButton, pointOutButton, pointerUpButton,
	disableButton, enableButton, tweenText } from './util.js';

// image imports
import txMenuTile from './assets/graphics/ui/menu_tile.png';
import imgGameTitle from './assets/graphics/ui/game_title.png'
import ssMenuItem from './assets/graphics/ui/menu_item.png';

// font imports
import fntpngBlock from './assets/graphics/fonts/Ubuntu-BoldWhite.png';
import fntxmlBlock from './assets/graphics/fonts/Ubuntu-BoldWhite.xml';
import fntCallig from './assets/graphics/fonts/Blenda_Script.otf';
import fntpngCallig from './assets/graphics/fonts/Blenda.png';
import fntxmlCallig from './assets/graphics/fonts/Blenda.xml';

// sound imports [TODO]


export default class MainMenu extends Phaser.Scene
{
	frameDefault = cfg.ui.menuItem.frameDefault;
	frameActive = cfg.ui.menuItem.frameActive;
	frameHover = cfg.ui.menuItem.frameHover;
	frameDisabled = cfg.ui.menuItem.frameDisabled;

	menuHeight = 6 * cfg.ui.menuItem.height + 12 * cfg.ui.menuItem.marginHeight;

    constructor()
    {
        super();
    }

    preload()
    {
        this.load.image('title', imgGameTitle);
		this.load.image('menu-tile', txMenuTile);
		this.load.spritesheet('menu-item',
			ssMenuItem,
			{ frameWidth: cfg.ui.menuItem.width, frameHeight: cfg.ui.menuItem.height },
		);
		this.load.bitmapFont('Faith-Block-BMF', fntpngBlock, fntxmlBlock);
		this.load.bitmapFont('Faith-Callig-BMF', fntpngCallig, fntxmlCallig);
		//[TODO] complete loading screen, possibly parent from a new class
		// that handles the loading screen
    }
      
    async create()
    {

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

		/*
		let testTween = this.add.tween({
			targets: this.title,
			alpha: 0.0,
			ease: 'Power2',
			duration: cfg.ui.menuItem.hoverTweenDuration,
		});
		testTween.setCallback('onComplete', function(params1, params2, params3) {
			console.log('test tween complete', params1, params2, params3);
		}, ['abcd', 'efgh']);
		*/

		// create the menu items
		this.menuItemGroups = this.add.group();
		this.menuItemGroups.setName('menu-item-groups');

		// we start from the main menu, not a submenu
		this.data.set('submenu', 'none');


		for (let k = 0; k <= 5; k++) {
			let item = this.add.image(0.0, 0.0, 'menu-item', this.frameDefault);
			item.setName('menu-item');

			item.setInteractive();
			item.on('pointerout', pointOutButton);
			item.on('pointerover', pointOverButton);
			item.on('pointerup', pointerUpButton);

			let itemHover = this.add.image(0.0, 0.0, 'menu-item', this.frameHover);
			itemHover.setName('menu-item-hover');
			itemHover.setAlpha(0.0);

			let itemActive = this.add.image(0.0, 0.0, 'menu-item', this.frameActive);
			itemActive.setName('menu-item-active');
			itemActive.setAlpha(0.0);

			let itemDisabled = this.add.image(0.0, 0.0, 'menu-item', this.frameDisabled);
			itemDisabled.setName('menu-item-disabled');
			itemDisabled.setAlpha(0.0);

			let text = this.add.bitmapText(0.0, 0.0, 'Faith-Block-BMF');
			text.setName('menu-text');


			let group = this.add.group();
			group.setName('menu-group-' + k);
			this.menuItemGroups.add(group);

			item.setData('group', group);
			itemHover.setData('group', group);
			itemActive.setData('group', group);
			itemDisabled.setData('group', group);
			text.setData('group', group);

			group.add(item);
			group.add(itemHover);
			group.add(itemActive);
			group.add(itemDisabled);
			group.add(text);
		}

		window.onresize = this.handleResize.bind(this);

		//position all UI elements
		this.handleResize();

		// put text in the menu items' textboxes
		this.assignMenuButtons(true);
    }

	/*
	* @method assignMenuButtons
	* Assign names to the menu buttons and set their frames (greying out disabled buttons etc).
	* 
	* @param {boolean} areNamesInstant - whether the buttons instantly receive their new names
	*/
	assignMenuButtons(areNamesInstant = false)
	{
		let groups = this.menuItemGroups.getChildren();

		// replace the entries in the following arrays as needed in your submenu

		// the button frames, which should indicate here whether or not the buttons are disabled
		let disabled = [false, false, false, false, false, false];

		// the text on the buttons
		let names = ['', '', '', '', '', ''];

		// the functions called when clicking the buttons
		let clickFns = [null, null, null, null, null, null];

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

				clickFns[3] = this.runTutorial;
				clickFns[4] = this.runLoadGame;
				clickFns[5] = this.runNewGame;
				break;
			case 'new':
				disabled[0] = true;

				names = ['', 'Back', 'Extra Vignettes',
					'Extra Campaigns', 'Official Vignettes', 'Official Campaigns'];

				clickFns[1] = this.runBackToMain;
				break;
			case 'load':
				disabled[0] = true;
				disabled[1] = true;
				disabled[2] = true;

				names = ['', '', '', 'Back', 'Load From File', 'Load From Server'];

				clickFns[3] = this.runBackToMain;
				break;
			default:
				throw "invalid submenu for the main menu in mainMenu.js";
		}

		// update the buttons
		for (let k = 0; k < 6; k++) {
			let item = groups[k].getMatching('name', 'menu-item')[0]; 
			let text = groups[k].getMatching('name', 'menu-text')[0];

			// reset the button item's events
			if (disabled[k] === true) {
				item.setData('buttonFunction', null);
				if (!item.getData('isDisabled')) {
					disableButton(item);
				}
			} else {
				item.setData('buttonFunction', clickFns[k]);
				if (item.getData('isDisabled')) {
					enableButton(item);
				}
			}

			// set the button text's new contents
			text.setData('newText', names[k]);
			if (areNamesInstant) {
				text.setText(names[k]);
			} else {
				tweenText(text);
			}
		}
	}



	handleResize() {
		/*
		* The canvas is resized and all game objects are scaled to fit into the canvas;
		* objects have a default height and width, and if the new canvas height or width is less
		* than the total default height or width of the objects and their margins (which equal
		* cfg.defaultGameHeight and cfg.defaultGameWidth because of how the game is planned),
		* the objects are scaled down along with their margins until both their height and width
		* fit into the game area (i.e. either scalingFactorWidth or scalingFactorHeight is
		* chosen, whichever is lowest, see below). If the new canvas height or width is larger
		* than the total default height or width of the objects and their margins, again, the
		* lowest scaling factor among scalingFactorWidth and scalingFactorHeight is used for
		* scaling the objects
		*/

		// the height and width of the game canvas
		let gameWidth, gameHeight;
	
		// resize the canvas
		if (this.registry.get('gameWidth') === null
				|| this.registry.get('gameHeight') === null) {
			gameWidth = window.innerWidth;
			gameHeight = window.innerHeight;
		} else {
			gameWidth = this.registry.get('gameWidth');
			gameHeight = this.registry.get('gameHeight');
		}
		console.log(gameWidth, gameHeight);

		this.scale.setGameSize(gameWidth, gameHeight);

		// compute the scaling factors; scalingFactor itself multiplies the sizes of all objects
		// and their margins, and equals either scalingFactorWidth or scalingFactorHeight,
		// whichever is lowest
		let scalingFactorWidth = gameWidth / cfg.defaultGameWidth;
		let scalingFactorHeight = gameHeight / cfg.defaultGameHeight;
		let sf = Math.min(scalingFactorHeight, scalingFactorWidth);

		// if the scaling factor is not too different from 1, round it to 1 to avoid
		// anti-aliasing
		if (Math.abs(sf - 1.0) < 0.001) {
			sf = 1;
		}

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
				let group = this.menuItemGroups.getChildren()[k];
				let item = group.getMatching('name', 'menu-item')[0];
				let itemHover = group.getMatching('name', 'menu-item-hover')[0];
				let itemActive = group.getMatching('name', 'menu-item-active')[0];
				let itemDisabled = group.getMatching('name', 'menu-item-disabled')[0];
				let text = group.getMatching('name', 'menu-text')[0];

				item.setScale(sf);
				itemHover.setScale(sf);
				itemActive.setScale(sf);
				itemDisabled.setScale(sf);
				text.setScale(sf);

				// all menu items go in the bottom-left corner
				item.setOrigin(0.0, 1.0); 
				itemHover.setOrigin(0.0, 1.0);
				itemActive.setOrigin(0.0, 1.0);
				itemDisabled.setOrigin(0.0, 1.0);

				// the text goes onto the middle of its related menu item
				text.setOrigin(0.5, 0.6); // setting Y above 0.5 because the origin needs to be at roughly the text's baseline

				let imageX = 0.0;
				let imageY = this.scale.height - k * cfg.ui.menuItem.height * sf
					 - (2 * k + 1) * cfg.ui.menuItem.marginHeight * sf;
				let textX = imageX + cfg.ui.menuItem.width / 2 * sf;
				let textY = imageY - cfg.ui.menuItem.height / 2 * sf;

				item.setPosition(imageX, imageY, 0);
				itemHover.setPosition(imageX, imageY, 0);
				itemActive.setPosition(imageX, imageY, 0);
				itemDisabled.setPosition(imageX, imageY, 0);
				text.setPosition(textX, textY, 1);

				group.incXY(cfg.ui.menu.marginWidth, -cfg.ui.menu.marginHeight);
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
				let group = this.menuItemGroups.getChildren()[k];
				let item = group.getMatching('name', 'menu-item')[0];
				let itemHover = group.getMatching('name', 'menu-item-hover')[0];
				let itemActive = group.getMatching('name', 'menu-item-active')[0];
				let itemDisabled = group.getMatching('name', 'menu-item-disabled')[0];
				let text = group.getMatching('name', 'menu-text')[0];

				item.setScale(sf);
				itemHover.setScale(sf);
				itemActive.setScale(sf);
				itemDisabled.setScale(sf);
				text.setScale(sf);

				// all menu items go in the bottom-left corner
				item.setOrigin(0.5, 1.0); 
				itemHover.setOrigin(0.5, 1.0);
				itemActive.setOrigin(0.5, 1.0);
				itemDisabled.setOrigin(0.5, 1.0);

				// the text goes onto the middle of its related menu item
				text.setOrigin(0.5, 0.6); // setting Y above 0.5 because the origin needs to be at roughly the text's baseline

				let imageX = this.scale.width / 2;
				let imageY = this.scale.height - k * cfg.ui.menuItem.height * sf
					 - (2 * k + 1) * cfg.ui.menuItem.marginHeight * sf;
				let textX = imageX;
				let textY = imageY - cfg.ui.menuItem.height / 2 * sf;

				item.setPosition(imageX, imageY, 0);
				itemHover.setPosition(imageX, imageY, 0);
				itemActive.setPosition(imageX, imageY, 0);
				itemDisabled.setPosition(imageX, imageY, 0);
				text.setPosition(textX, textY, 1);

				group.incXY(cfg.ui.menu.marginWidth, -cfg.ui.menu.marginHeight);
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

