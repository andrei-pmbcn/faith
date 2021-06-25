import Phaser from 'phaser';
import cfg from '../config.js';

export default class FaithScene extends Phaser.Scene
{
	constructor() {
		super();
	}

	preload() {

	}

	create() {

	}

	/*
	* The canvas is resized and all game objects are scaled to fit into the canvas;
	* objects have a default height and width, and if the new canvas height or width is less
	* than the total default height or width of the objects and their margins (which equal
	* cfg.defaultGameHeight and cfg.defaultGameWidth because of how the game is planned),
	* the objects are scaled down along with their margins until both their height and width
	* fit into the game area (i.e. either scalingFactorWidth or scalingFactorHeight is
	* chosen, whichever is lowest, see below).

	* If the new canvas height or width is larger than the total default height or width
	* of the objects and their margins, again, the lowest scaling factor among
	* scalingFactorWidth and scalingFactorHeight is used for scaling the objects
	*/
	handleResize() {
		// the height and width of the game canvas
		let gameWidth, gameHeight;
	
		// resize the scene
		if (this.registry.get('gameWidth') === null
				|| this.registry.get('gameHeight') === null) {
			gameWidth = window.innerWidth;
			gameHeight = window.innerHeight;
		} else {
			gameWidth = this.registry.get('gameWidth');
			gameHeight = this.registry.get('gameHeight');
		}
		this.scale.setGameSize(gameWidth, gameHeight);

		// compute the scaling factors; scalingFactor itself multiplies the sizes of all objects
		// and their margins, and equals either scalingFactorWidth or scalingFactorHeight,
		// whichever is lowest
		let scalingFactorWidth, scalingFactorHeight, sf;
		if (this.scale.width > this.scale.height) {
			// we are in landscape mode
			scalingFactorWidth = gameWidth / cfg.defaultGameWidth;
			scalingFactorHeight = gameHeight / cfg.defaultGameHeight;
		} else {
			// we are in portrait mode, swap defaultGameHeight and defaultGameWidth around
			// because the default here is a portrait resolution, whereas the normal default
			// is a landscape resolution
			scalingFactorWidth = gameWidth / cfg.defaultGameHeight;
			scalingFactorHeight = gameHeight / cfg.defaultGameWidth;
		}
		sf = Math.min(scalingFactorHeight, scalingFactorWidth);

		// if the scaling factor is not too different from 1, round it to 1 to avoid
		// anti-aliasing
		if (Math.abs(sf - 1.0) < 0.001) {
			sf = 1;
		}

		this.data.set('scalingFactor', sf);
	}
}
