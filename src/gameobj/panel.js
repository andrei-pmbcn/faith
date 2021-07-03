/**
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

/**
* @namespace Faith.UI
*/

// script imports
import cfg from '../config.js';

/**
* The panel is a basic user interface element with a border, a background
* and optional contents. It will rescale and move these contents as it
* itself is rescaled or moved.
*
* @memberof Faith.UI
*/
class Panel
{
	/**
	* {number} the width of a single piece of border, e.g. one corner
	* or one vertical tile
	**/
	static pieceWidth = cfg.ui.panel.pieceWidth;

	/**
	* {number} the height of a single piece of border, e.g. one corner
	* or one vertical tile
	**/ 
	static pieceHeight = cfg.ui.panel.pieceHeight;
	
	/*
	* Generates a panel, complete with normal and disabled states
	*
	* @param {Phaser.Scene} scene
	* @param {number} [x] the panel's x position
	* @param {number} [y] the panel's y position
	* @param {number} width the panel's width, a minimum of 32;
	* should be a multiple of 16 in order for the panel to look good
	* @param {number} height the panel's height, a minimum of 32
	* @param {string} [borderImage] the name of the loaded image for the
	* panel's border
	* @param {string} [cornerShadowImage] the name of the loaded image
	* for the panel's corner shadow
	* @param {string} [bgImage] the name of the loaded image for the
	* panel's background
	* @param {string} [bgDisabledImage] the name of the loaded image for
	* the panel's background in disabled mode
	*/
    constructor(scene, x = 0, y = 0,
		width = 2 * cfg.ui.panel.pieceWidth,
		height = 2 * cfg.ui.panel.pieceHeight,
		borderImage = 'panel-border',
		cornerShadowImage = 'panel-corner-shadow',
		bgImage = 'panel-tile',
		bgDisabledImage = 'panel-tile-disabled')
    {
		this.scene = scene;

		//check whether the needed image files have been loaded
		let errstr;
		if (!this.scene.textures.exists(borderImage)) {
			errstr = 'border texture ' + borderImage
				+ ' not found: cannot create panel.'
			alert(errstr);
			throw errstr;
			return;
		}

		if (!this.scene.textures.exists(cornerShadowImage)) {
			errstr = 'corner shadow texture ' + cornerShadowImage
				+ ' not found: cannot create panel.'
			alert(errstr);
			throw errstr;
			return;
		}

		if (!this.scene.textures.exists(bgImage)) {
			errstr = 'background texture ' + bgImage + ' not found: cannot create panel.'
			alert(errstr);
			throw errstr;
			return;
		}

		if (!this.scene.textures.exists(bgDisabledImage)) {
			errstr = 'background (disabled) texture ' + bgDisabledImage
				+ ' not found: cannot create panel.'
			alert(errstr);
			throw errstr;
			return;
		}

		/*
		* The panel's x coordinate
		* 
		* @name x
		* @type {number}
		*/
		this.x = x;

		/*
		* The panel's y coordinate
		* 
		* @name y
		* @type {number}
		*/
		this.y = y;

		if (height < 32 || width < 32) {
			errstr = 'panel width or height below 32: cannot create panel.'
			alert(errstr);
			throw errstr;
		} 

		/*
		* The panel's base (unscaled) width
		*
		* @name baseWidth
		* @type {number}
		*/
		this.baseWidth = width;

		/*
		* The panel's base (unscaled) height
		*
		* @name baseHeight
		* @type {number}
		*/
		this.baseHeight = height;

		// add the shadow of the panel
		// this goes first because it's meant to be partially covered by the panel
		this.shadowTopLeft = this.scene.add.image(this._getLeftX(), this._getTopY(),
			cornerShadowImage);

		this.shadowTopEdge = this.scene.add.tileSprite(this.x, this._getTopY(),
			this._getHBorderEdgeWidth(), Panel.pieceHeight,
			borderImage, cfg.ui.panel.frameHorizontalShadow);

		this.shadowTopRight = this.scene.add.image(this._getRightX(), this._getTopY(),
			cornerShadowImage);

		this.shadowRightEdge = this.scene.add.tileSprite(this._getRightX(), this.y,
			Panel.pieceWidth, this._getVBorderEdgeHeight(),
			borderImage, cfg.ui.panel.frameVerticalShadow);

		this.shadowBottomRight = this.scene.add.image(this._getRightX(), this._getBottomY(),
			cornerShadowImage);

		this.shadowBottomEdge = this.scene.add.tileSprite(this.x, this._getBottomY(),
			this._getHBorderEdgeWidth(), Panel.pieceHeight,
			borderImage, cfg.ui.panel.frameHorizontalShadow);

		this.shadowBottomLeft = this.scene.add.image(this._getLeftX(), this._getBottomY(),
			cornerShadowImage);

		this.shadowLeftEdge = this.scene.add.tileSprite(this._getLeftX(), this.y,
			Panel.pieceWidth, this._getVBorderEdgeHeight(),
			borderImage, cfg.ui.panel.frameVerticalShadow);

		// add the normal and disabled background
		// this goes before the border because it's meant to be partially covered by it
		this.bg = this.scene.add.tileSprite(this.x, this.y,
			(this.baseWidth - Panel.pieceWidth) * this.scale,
			(this.baseHeight - Panel.pieceHeight) * this.scale,
			bgImage);

		this.bgDisabled = this.scene.add.tileSprite(this.x, this.y,
			(this.baseWidth - Panel.pieceWidth) * this.scale,
			(this.baseHeight - Panel.pieceHeight) * this.scale,
			bgDisabledImage);
		this.bgDisabled.setAlpha(0.0);

		// add the panel border edges
		// these go before the corners because they partially go under them
		this.borderTopEdge = this.scene.add.tileSprite(this.x, this._getTopY(),
			this._getHBorderEdgeWidth(), Panel.pieceHeight,
			borderImage, cfg.ui.panel.frameHorizontalEdge);

		this.borderTopEdgeDisabled = this.scene.add.tileSprite(this.x, this._getTopY(),
			this._getHBorderEdgeWidth(), Panel.pieceHeight,
			borderImage, cfg.ui.panel.frameHorizontalEdgeDisabled);
		this.borderTopEdgeDisabled.setAlpha(0.0);

		this.borderRightEdge = this.scene.add.tileSprite(this._getRightX(), this.y,
			Panel.pieceWidth, this._getVBorderEdgeHeight(),
			borderImage, cfg.ui.panel.frameVerticalEdge);

		this.borderRightEdgeDisabled = this.scene.add.tileSprite(this._getRightX(), this.y,
			Panel.pieceWidth, this._getVBorderEdgeHeight(),
			borderImage, cfg.ui.panel.frameVerticalEdgeDisabled);
		this.borderRightEdgeDisabled.setAlpha(0.0);

		this.borderBottomEdge = this.scene.add.tileSprite(this.x, this._getBottomY(),
			this._getHBorderEdgeWidth(), Panel.pieceHeight,
			borderImage, cfg.ui.panel.frameHorizontalEdge);

		this.borderBottomEdgeDisabled = this.scene.add.tileSprite(this.x, this._getBottomY(),
			this._getHBorderEdgeWidth(), Panel.pieceHeight,
			borderImage, cfg.ui.panel.frameHorizontalEdgeDisabled);
		this.borderBottomEdgeDisabled.setAlpha(0.0);

		this.borderLeftEdge = this.scene.add.tileSprite(this._getLeftX(), this.y,
			Panel.pieceWidth, this._getVBorderEdgeHeight(),
			borderImage, cfg.ui.panel.frameVerticalEdge);

		this.borderLeftEdgeDisabled = this.scene.add.tileSprite(this._getLeftX(), this.y,
			Panel.pieceWidth, this._getVBorderEdgeHeight(),
			borderImage, cfg.ui.panel.frameVerticalEdgeDisabled);
		this.borderLeftEdgeDisabled.setAlpha(0.0);


		// add the panel border
		this.borderTopLeft = this.scene.add.image(this._getLeftX(), this._getTopY(),
			borderImage, cfg.ui.panel.frameTopLeftCorner);

		this.borderTopLeftDisabled = this.scene.add.image(this._getLeftX(), this._getTopY(),
			borderImage, cfg.ui.panel.frameTopLeftCornerDisabled);
		this.borderTopLeftDisabled.setAlpha(0.0);
		
		this.borderTopRight = this.scene.add.image(this._getRightX(), this._getTopY(),
			borderImage, cfg.ui.panel.frameTopRightCorner);

		this.borderTopRightDisabled = this.scene.add.image(this._getRightX(), this._getTopY(),
			borderImage, cfg.ui.panel.frameTopRightCornerDisabled);
		this.borderTopRightDisabled.setAlpha(0.0);

		this.borderBottomRight = this.scene.add.image(this._getRightX(), this._getBottomY(),
			borderImage, cfg.ui.panel.frameTopLeftCorner);

		this.borderBottomRightDisabled = this.scene.add.image(this._getRightX(), this._getBottomY(),
			borderImage, cfg.ui.panel.frameTopLeftCornerDisabled);
		this.borderBottomRightDisabled.setAlpha(0.0);
		
		this.borderBottomLeft = this.scene.add.image(this._getLeftX(), this._getBottomY(),
			borderImage, cfg.ui.panel.frameTopRightCorner);

		this.borderBottomLeftDisabled = this.scene.add.image(this._getLeftX(), this._getBottomY(),
			borderImage, cfg.ui.panel.frameTopRightCornerDisabled);
		this.borderBottomLeftDisabled.setAlpha(0.0);
	}
	

	/**
	* the objects placed within the panel
	* 
	* @type {Array}
	* @default []
	*/
	contents = [];

	/**
	* whether the panel is disabled
	*
	* @type {boolean}
	* @default false
	*/
	isDisabled = false;

	/**
	* the panel's previous scale
	* 
	* @type {number}
	* @default 1
	*/
	oldScale = 1;

	/**
	* the panel's current scale
	*
	* @type {number}
	* @default 1
	*/
	scale = 1;

	/**
	* the panel's current tween, used for clearing the tween when a new tween occurs
	*
	* @type {Phaser.Tweens.Tween}
	* @default null
	*/
	tween = null;

	/**
	* enable the panel, making it show its normal background and border images
	*/
	enable() {
		if (!this.isDisabled)
			return;

		this._tweenDisabledAlpha(0.0);
		this.isDisabled = false;
	}

	disable() {
		if (this.isDisabled)
			return;

		this._tweenDisabledAlpha(1.0);
		this.isDisabled = true;
	}

	/**
	* sets the panel's scale, along with the scales of all its contents
	* 
	* @param {number} sf - the new scale of the panel
	* @param {boolean} [scaleToSceneOrigin=false] - whether to treat the scene origin
	*   as the panel's scaling origin, and thus reposition the panel
	* 
	*/
	setScale(sf, scaleToSceneOrigin = false) {
		this.oldScale = this.scale;
		this.scale = sf;

		this.shadowTopLeft.setScale(sf);
		this.shadowTopEdge.setScale(sf);
		this.shadowTopRight.setScale(sf);
		this.shadowRightEdge.setScale(sf);
		this.shadowBottomRight.setScale(sf);
		this.shadowBottomEdge.setScale(sf);
		this.shadowBottomLeft.setScale(sf);
		this.shadowLeftEdge.setScale(sf);

		this.borderTopLeft.setScale(sf);
		this.borderTopEdge.setScale(sf);
		this.borderTopRight.setScale(sf);
		this.borderRightEdge.setScale(sf);
		this.borderBottomRight.setScale(sf);
		this.borderBottomEdge.setScale(sf);
		this.borderBottomLeft.setScale(sf);
		this.borderLeftEdge.setScale(sf);

		this.borderTopLeftDisabled.setScale(sf);
		this.borderTopEdgeDisabled.setScale(sf);
		this.borderTopRightDisabled.setScale(sf);
		this.borderRightEdgeDisabled.setScale(sf);
		this.borderBottomRightDisabled.setScale(sf);
		this.borderBottomEdgeDisabled.setScale(sf);
		this.borderBottomLeftDisabled.setScale(sf);
		this.borderLeftEdgeDisabled.setScale(sf);

		this.bg.setScale(sf);
		this.bgDisabled.setScale(sf);

		for (let content of this.contents) {
			if (content.setScale) {
				content.setScale(sf);
			}
		}

		if (scaleToSceneOrigin) {
			let newX = this.x * this.scale / this.oldScale;
			let newY = this.y * this.scale / this.oldScale;

			this.setPosition(newX, newY);
		}

		this.oldScale = this.scale;
	}

	/*
	* set the panel's position and move the positions of all its contents
	*
	* @param {number} x - the panel's new x position
	* @param {number} y - the panel's new y position
	*/
	setPosition(x, y, scaleToSceneOrigin = false) {
		let oldPanelX = this.x;
		let oldPanelY = this.y;

		this.x = x;
		this.y = y;

		this.shadowTopLeft.setPosition(this._getLeftX(), this._getTopY());
		this.shadowTopEdge.setPosition(this.x, this._getTopY());
		this.shadowTopRight.setPosition(this._getRightX(), this._getTopY());
		this.shadowRightEdge.setPosition(this._getRightX(), this.y);
		this.shadowBottomRight.setPosition(this._getRightX(), this._getBottomY());
		this.shadowBottomEdge.setPosition(this.x, this._getBottomY());
		this.shadowBottomLeft.setPosition(this._getLeftX(), this._getBottomY());
		this.shadowLeftEdge.setPosition(this._getLeftX(), this.y);

		this.borderTopLeft.setPosition(this._getLeftX(), this._getTopY());
		this.borderTopEdge.setPosition(this.x, this._getTopY());
		this.borderTopRight.setPosition(this._getRightX(), this._getTopY());
		this.borderRightEdge.setPosition(this._getRightX(), this.y);
		this.borderBottomRight.setPosition(this._getRightX(), this._getBottomY());
		this.borderBottomEdge.setPosition(this.x, this._getBottomY());
		this.borderBottomLeft.setPosition(this._getLeftX(), this._getBottomY());
		this.borderLeftEdge.setPosition(this._getLeftX(), this.y);

		this.borderTopLeftDisabled.setPosition(this._getLeftX(), this._getTopY());
		this.borderTopEdgeDisabled.setPosition(this.x, this._getTopY());
		this.borderTopRightDisabled.setPosition(this._getRightX(), this._getTopY());
		this.borderRightEdgeDisabled.setPosition(this._getRightX(), this.y);
		this.borderBottomRightDisabled.setPosition(this._getRightX(), this._getBottomY());
		this.borderBottomEdgeDisabled.setPosition(this.x, this._getBottomY());
		this.borderBottomLeftDisabled.setPosition(this._getLeftX(), this._getBottomY());
		this.borderLeftEdgeDisabled.setPosition(this._getLeftX(), this.y);

		this.bg.setPosition(x, y);
		this.bgDisabled.setPosition(x, y);

		// reposition the panel's contents
		// if setPosition() has not been invoked from this.setScale(), then the
		// this.scale / this.oldScale in these calculations will equal 1.0 and
		// therefore be ignored 
		for (let content of this.contents) {
			if (content.x !== undefined && content.y !== undefined && content.setPosition) {
				let oldContentX = content.x;
				let oldContentY = content.y;

				// each coordinate can be calculated as follows (x is given as an example):
				// global_x_old = local_x_old + panel_x_old
				//   (where local_x_old is the position of the content relative to the panel)
				// global_x_new = local_x_new + panel_x_new
				// local_x_new = local_x_old * new_scale / old_scale
				//   (if the panel has been rescaled)
				// therefore:
				// global_x_new = local_x_old * new_scale / old_scale + panel_x_new
				// global_x_new = (global_x_old - panel_x_old) * new_scale / old_scale
				//   + panel_x_new

				let newContentX = (oldContentX - oldPanelX) * this.scale / this.oldScale + x
				let newContentY = (oldContentY - oldPanelY) * this.scale / this.oldScale + y

				content.setPosition(newContentX, newContentY);
			}
		}
	}

	/**
	* Internal method; gets the x position of the center of the panel's left border
	*
	* @access private
	*
	* @return {number} the left x coordinate
	*/
	_getLeftX() {
		return this.x - (this.baseWidth - Panel.pieceWidth) / 2 * this.scale;
	}

	/**
	* Internal method; gets the x position of the center of the panel's right border
	*
	* @access private
	*
	* @return {number} the right x coordinate
	*/
	_getRightX() {
		return this.x + (this.baseWidth - Panel.pieceWidth) / 2 * this.scale;
	}

	/**
	* Internal method; gets the y position of the center of the panel's top border
	*
	* @access private
	*
	* @return {number} the top y coordinate
	*/
	_getTopY() {
		return this.y - (this.baseHeight - Panel.pieceHeight) / 2 * this.scale;
	}

	/**
	* Internal method; gets the y position of the center of the panel's bottom border
	*
	* @access private
	*
	* @return {number} the bottom y coordinate
	*/
	_getBottomY() {
		return this.y + (this.baseHeight - Panel.pieceHeight) / 2 * this.scale;
	}

	/**
	* Internal method; gets the vertical border edge height of the panel.
	*
	* each border edge will overlap with half of each corner, each corner being
	* equivalent to one piece in height and width
	*
	* @access private
	*
	* @return {number} the vertical border edge height
	*/
	_getVBorderEdgeHeight() {
		return (this.baseHeight - Panel.pieceHeight) * this.scale;
	}

	/**
	* Internal method; gets the horizontal border edge width of the panel.
	*
	* each border edge will overlap with half of each corner, each corner being
	* equivalent to one piece in height and width
	*
	* @access private
	*
	* @return {number} the horizontal border edge width
	*/
	_getHBorderEdgeWidth() {
		return (this.baseWidth - Panel.pieceWidth) * this.scale;
	}

	/**
	* Internal method; tweens the alpha value of the panel's disabled background
	* and border
	*
	* @access private
	* 
	* @param {number} alpha - The alpha value to be tweened to
	* 
	* @return {Phaser.Tweens.Tween} the generated tween
	*/
	_tweenDisabledAlpha(alpha) {
		if (this.tween !== null) {
			this.tween.remove();
			this.tween = null;
		}

		this.tween = this.scene.add.tween({
			targets: [
				this.borderTopLeftDisabled,
				this.borderTopEdgeDisabled,
				this.borderTopRightDisabled,
				this.borderRightEdgeDisabled,
				this.borderBottomRightDisabled,
				this.borderBottomEdgeDisabled,
				this.borderBottomLeftDisabled,
				this.borderLeftEdgeDisabled,
			],
			alpha: alpha,
			ease: 'Power2',
			duration: cfg.ui.panel.disabledTweenDuration,
		});
	}
}

export default Panel;
