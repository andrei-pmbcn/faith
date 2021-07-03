/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import cfg from '../config.js';

/**
* The TextButton class contains a button image and text overlayed on top
* of it. It has a hover animation, a pressed animation and an animation
* to and from its disabled state, which can be toggled on and off.
*
* After being clicked, the button will call its `action` method.
*
* @memberof Faith.UI
*/
class TextButton
{
	/**
	* Generates a text button, complete with images for its base,
	* pressed, hover and disabled states, and text.
	*
	* @param {Phaser.Scene} scene - the button's Scene 
	* @param {number} [x] - the button's x position 
	* @param {number} [y] - the button's y position 
	* @param {string} [text] - the button's text
	* @param {string} [image] - the name of the loaded image for the button
	* @param {string} [font] - the name of the loaded font for the button
	*/
    constructor(
			scene,
			x = 0,
			y = 0,
			text = '',
			image = 'text-button',
			font = 'button-BMF')
		{
		this.scene = scene;		

		//check whether the specified font and image file have been loaded
		let errstr;
		if (!this.scene.textures.exists(image)) {
			errstr = 'image texture ' + image
				+ ' not found: cannot create button.'
			alert(errstr);
			throw errstr;
			return;
		}

		if (!this.scene.textures.exists(font)) {
			errstr = 'font texture ' + font
				+ ' not found: cannot create button.'
			alert(errstr);
			throw errstr;
			return;
		}

		this.x = x;
		this.y = y;
		this.scale = 1;

		this.base = this.scene.add.image(x, y, image,
			cfg.ui.textButton.frameBase);
		this.base.setInteractive();
		this.base.on('pointerout', this._pointOut.bind(this));
		this.base.on('pointerover', this._pointOver.bind(this));
		this.base.on('pointerup', this._pointUp.bind(this));
		this.action = this.disabledAction;

		this.hover = this.scene.add.image(x, y, image,
				cfg.ui.textButton.frameHover)
			.setAlpha(0.0);

		this.pressed = this.scene.add.image(x, y, image,
				cfg.ui.textButton.framePressed)
			.setAlpha(0.0);

		this.disabled = this.scene.add.image(x, y, image,
				cfg.ui.textButton.frameDisabled)
			.setAlpha(0.0);

		this.text = this.scene.add.bitmapText(x, y, font)
			.setOrigin(0.5, 0.6);

		this.width = this.base.width;
		this.height = this.base.height;
    }


/*
	/**
	* the function called by default when the button is clicked but is
	* disabled
	*
	* @type {function}
	* @default an empty function
	*/
	disabledAction = function() {}

	/**
	* the function called when the button is clicked
	*
	* @ype {function}
	* @default null
	*/
	action = null;

	/**
	* whether the button is disabled, i.e. cannot be interacted with
	* 
	* @type {boolean}
	* @default false
	*/
	isDisabled = false;

	/**
	* disables the button, preventing it from being clicked and disabling
	* its hover animation
	*/
	disable() {
		if(this.isDisabled)
			return;

		this.isDisabled = true;
		this._tweenButton('disable');	
	}

	/**
	* enables the button, allowing it to be clicked and enabling its hover
	* animation
	*/
	enable() {
		if(!this.isDisabled)
			return;

		this.isDisabled = false;
		this._tweenButton('enable');
	}

	/**
	* sets the button's scale
	* 
	* @param {number} sf - the new scale of the panel
	*/
	setScale(sf) {
		this.scale = sf;

		this.base.setScale(sf);
		this.hover.setScale(sf);
		this.pressed.setScale(sf);
		this.disabled.setScale(sf);
		this.text.setScale(sf);
	}

	/**
	* sets the button's x and y position
	* 
	* @param {number} x - the button's new x coordinate
	* @param {number} y - the button's new y coordinate
	*/
	setPosition(x, y) {
		this.x = x;
		this.y = y;

		this.base.setPosition(x, y);
		this.hover.setPosition(x, y);
		this.pressed.setPosition(x, y);
		this.disabled.setPosition(x, y);
		this.text.setPosition(x, y);
	}

	/**
	* Instantly sets the text for the button.
	*
	* @param {string} - text the text to be set
	*/
	setText(newText) {
		this.text.setText(newText);
	}

	/**
	* Makes the text transparent via tweening, replaces the words in
	* the text, then makes the text opaque again.
	*
	* @param {string} - text the text to be written
	*/
	tweenText(newText) {
		let textTween = this.text.getData('tween');
		if (textTween) {
			textTween.remove();
			this.text.data.remove('tween');
		}

		textTween = this.scene.add.tween({
			targets: this.text,
			alpha: 0.0,
			ease: 'Power2',
			duration: cfg.ui.textButton.textTweenDuration,
		});

		this.text.setData('tween', textTween);
		textTween.setCallback('onComplete', function() {
			this.text.setText(newText);

			let secondTextTween = this.scene.add.tween({
				targets: this.text,
				alpha: 1.0,
				ease: 'Power2',
				duration: cfg.ui.textButton.textTweenDuration,
			});		
			this.text.setData('tween',  secondTextTween);
		}.bind(this), [])
	}

	/**
	* internal callback called when the button is hovered over
	*
	* @access private
	*/
	_pointOver() {
		if(this.isDisabled)
			return;

		this._tweenButton('pointerOver');
	}

	/**
	* Internal callback called when the button is no longer hovered over
	*
	* @access private
	*/
	_pointOut() {
		if(this.isDisabled)
			return;

		//this.setData('buttonHover', false);
		this._tweenButton('pointerOut');
	}

	/**
	* Internal callback called when the button has stopped being clicked
	*
	* @access private
	*/
	_pointUp() {
		if(this.isDisabled)
			return;

		// do not trigger further buttons when a button is already pressed
		if (this.scene.data.get('buttonActive') === true)
			return;

		this.scene.data.set('buttonActive', true);
		this._tweenButton('pointerUp');
	}

	/**
	* Internal method that performs a transition to or from the base,
	* pressed and hover versions of the given button image, showing or
	* hiding these versions via their alpha values as needed. 
	*
	* The hover version is always created above the default version of the
	* same item, and the pressed version goes above the hover version; the
	* alpha values of the hover and pressed versions default to 0.0. Because
	* of this, only the hover and pressed versions need to have their alpha
	* values tweened.
	*
	* @access private
	*
	* @param {string} type - a string indicating the type of tween to be
	* executed; can be either 'pointerOver', 'pointerOut', 'pointerUp',
	* 'enable' or 'disable'.
	*/
	_tweenButton(type) {
		let pressedTween = this.pressed.getData('tween');
		let hoverTween = this.hover.getData('tween');
		let disabledTween = this.disabled.getData('tween');

		// if the item's pointerOver tween is ongoing, clear it and, if
		// another type of tween is being started by this function,
		// initiate a quick tween to clear the ongoing hover graphics
		if (hoverTween && (
				type === 'pointerUp'
				|| type === 'disable'
				|| type === 'enable')) {
			this.hover.data.remove('tween');
			hoverTween.remove();

			hoverTween = this.scene.add.tween({
				targets: this.hover,
				alpha: 0.0,
				ease: 'Power2',
				duration: cfg.ui.textButton.hoverTweenDuration / 2,
			});
		} else if (hoverTween) {
			this.hover.data.remove('tween');
			hoverTween.remove();
		}

		switch (type) {
			case 'pointerOver':
				hoverTween = this.scene.add.tween({
					targets: this.hover,
					alpha: 1.0,
					ease: 'Power2',
					duration: cfg.ui.textButton.hoverTweenDuration,
				});
				this.hover.setData('tween', hoverTween);
			break;

			case 'pointerOut':
				hoverTween = this.scene.add.tween({
					targets: this.hover,
					alpha: 0.0,
					ease: 'Power2',
					duration: cfg.ui.textButton.hoverTweenDuration,
				});
				this.hover.setData('tween', hoverTween);
			break;

			case 'pointerUp':
				if (pressedTween) {
					this.pressed.data.remove('tween');
					pressedTween.remove();
				}

				pressedTween = this.scene.add.tween({
						targets: this.pressed,
						alpha: 1.0,
						ease: 'Power2',
						duration: cfg.ui.textButton.pressedTweenDuration,
					});
				this.pressed.setData('tween', pressedTween);
				
				pressedTween.setCallback('onComplete', function() {
					let secondPressedTween = this.scene.add.tween({
						targets: this.pressed,
						alpha: 0.0,
						ease: 'Power2',
						duration: cfg.ui.textButton.pressedTweenDuration,
					});
					this.pressed.setData('tween', secondPressedTween);

					secondPressedTween.setCallback('onComplete',
						function() {
							this.pressed.data.remove('tween');
							this.scene.data.set('buttonActive', false);
							this.action();
						}.bind(this), []);
				}.bind(this), []);
			break;

			case 'disable':
				if (disabledTween) {
					this.disabled.data.remove('tween');
					disabledTween.remove();
				}
				disabledTween = this.scene.add.tween({
					targets: this.disabled,
					alpha: 1.0,
					ease: 'Power1',
					duration: cfg.ui.textButton.disabledTweenDuration,
				});
				this.disabled.setData('tween', disabledTween);
			break;

			case 'enable':
				if (disabledTween) {
					this.disabled.data.remove('tween');
					disabledTween.remove();
				}
				disabledTween = this.scene.add.tween({
					targets: this.disabled,
					alpha: 0.0,
					ease: 'Power1',
					duration: cfg.ui.textButton.disabledTweenDuration,
				});
				this.disabled.setData('tween', disabledTween);
			break;

			default:
				throw 'invalid button tween type';
		}
	}
}

export default TextButton;
