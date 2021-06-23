import cfg from './config.js';

/* @function tweenMenuItem(item, type): 
*   Performs a transition to or from the default, active and hover versions of the given button item,
*   showing or hiding these versions via their alpha values as needed. Requires the menu item to be
*   in a group with its hover and active versions, and for their names to be 'menu-item', 'menu-item-hover'
*   and 'menu-item-active' respectively.
*   
*   The hover version is always created above the default version of the same item, and the active version
*   goes above the hover version; the alpha values of the hover and active versions default to 0.0. Because
*   of this, only the hover and active versions need to have their alpha values tweened.
*
*   @param {Object} item - the menu item affected
*   @param {string} type - a string indicating the type of tween to be executed
*/
function tweenMenuItem(item, type) {
	// Get the item's group to get its active and hover versions
	let group = item.data.get('group');
	let active = group.getMatching('name', 'menu-item-active')[0];
	let hover = group.getMatching('name', 'menu-item-hover')[0];
	let disabled = group.getMatching('name', 'menu-item-disabled')[0];

	let activeTween = active.getData('tween');
	let hoverTween = hover.getData('tween');
	let disabledTween = disabled.getData('tween');

	// if the item's pointerOver tween is ongoing, clear it and, if another type of tween is being started
	// by this function, initiate a quick tween to clear the ongoing hover graphics
	if (hoverTween && (type === 'pointerUp' || type === 'disable' || type === 'enable')) {
		hoverTween = item.scene.add.tween({
			targets: hover,
			alpha: 0.0,
			ease: 'Power2',
			duration: cfg.ui.menuItem.hoverTweenDuration / 2,
		});
	}
	if (hoverTween) {
		hover.data.remove('tween');
		hoverTween.remove();
	}

	switch (type) {
		case 'pointerOver':
			hoverTween = item.scene.add.tween({
				targets: hover,
				alpha: 1.0,
				ease: 'Power2',
				duration: cfg.ui.menuItem.hoverTweenDuration,
			});
			hover.setData('tween', hoverTween);
		break;

		case 'pointerOut':
			hoverTween = item.scene.add.tween({
				targets: hover,
				alpha: 0.0,
				ease: 'Power2',
				duration: cfg.ui.menuItem.hoverTweenDuration,
			});
			hover.setData('tween', hoverTween);
		break;

		case 'pointerUp':
			activeTween = item.scene.add.tween({
					targets: active,
					alpha: 1.0,
					ease: 'Power2',
					duration: cfg.ui.menuItem.activeTweenDuration,
				});
			active.setData('tween', activeTween);
			
			activeTween.setCallback('onComplete', function() {
				let secondActiveTween = item.scene.add.tween({
					targets: active,
					alpha: 0.0,
					ease: 'Power2',
					duration: cfg.ui.menuItem.activeTweenDuration,
				});
				active.setData('tween', secondActiveTween);

				secondActiveTween.setCallback('onComplete', function() {
					active.data.remove('tween');
					//item.setData('ButtonActive', false);
					item.scene.data.set('buttonActive', false);
					item.getData('buttonFunction').bind(item)();
					//item.emit('menuItemActiveFinished');
				}, []);
			}, []);
		break;

		case 'disable':
			if (disabledTween) {
				disabled.data.remove('tween');
				disabledTween.remove();
			}
			disabledTween = item.scene.add.tween({
				targets: disabled,
				alpha: 1.0,
				ease: 'Power1',
				duration: cfg.ui.menuItem.disabledTweenDuration,
			});
			disabled.setData('tween', disabledTween);
		break;

		case 'enable':
			if (disabledTween) {
				disabled.data.remove('tween');
				disabledTween.remove();
			}
			disabledTween = item.scene.add.tween({
				targets: disabled,
				alpha: 0.0,
				ease: 'Power1',
				duration: cfg.ui.menuItem.disabledTweenDuration,
			});
			disabled.setData('tween', disabledTween);
		break;

		default:
			throw 'invalid tween type';

	}

}


export function pointOverButton() {
	if(this.getData('isDisabled'))
		return;

	//this.setData('buttonHover', true);
	tweenMenuItem(this, 'pointerOver');
}


export function pointOutButton() {
	if(this.getData('isDisabled'))
		return;

	//this.setData('buttonHover', false);
	tweenMenuItem(this, 'pointerOut');
}


export function pointerUpButton() {
	if(this.getData('isDisabled'))
		return;

	// do not trigger further buttons when a button is already active
	if (this.scene.data.get('buttonActive') === true)
		return;

	//this.setData('buttonActive', true);
	this.scene.data.set('buttonActive', true);
	tweenMenuItem(this, 'pointerUp');
}


export function disableButton(item) {
	if(item.getData('isDisabled'))
		return;

	item.setData('isDisabled', true);
	tweenMenuItem(item, 'disable');	
}


export function enableButton(item) {
	if(!item.getData('isDisabled'))
		return;

	item.setData('isDisabled', false);
	tweenMenuItem(item, 'enable');
}

/* @function tweenText(text)
*	Makes the text transparent via tweening, changes the words in the text to the text object's
*   'newText' data and makes the text opaque again. Requires the text object's 'newText' data to be set.
*
*   @param {Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText} text - the text to be changed
*/
export function tweenText(text) {


	let textTween = text.getData('tween');
	if (textTween) {
		textTween.remove();
		text.data.remove('tween');
	}

	let newText = text.getData('newText');

	textTween = text.scene.add.tween({
		targets: text,
		alpha: 0.0,
		ease: 'Power2',
		duration: cfg.ui.menuItem.textTweenDuration,
	});

	text.setData('tween', textTween);
	textTween.setCallback('onComplete', function() {
		text.setText(newText);

		let secondTextTween = text.scene.add.tween({
			targets: text,
			alpha: 1.0,
			ease: 'Power2',
			duration: cfg.ui.menuItem.textTweenDuration,
		});		
		text.setData('tween',  secondTextTween);
	}, [])
}

