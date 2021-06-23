import Phaser from 'phaser';
import mainMenu from './mainMenu.js';
import cfg from './config.js'

const phaserConfig = {
    type: Phaser.AUTO,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		scaleMode: Phaser.Scale.ScaleModes.NONE,
    parent: 'fota-game',
    width: window.innerWidth,
    height: window.innerHeight,
    scene: mainMenu,
};

//[TODO] Configure game for multiple aspect ratios, portrait and landscape

const game = new Phaser.Game(phaserConfig);

//[TODO] handle login and registration
game.registry.set('isLoggedIn', false);
game.registry.set('username', '');

// Set the width and height to be null, which means they match the
// window's height and width;
// [TODO] set these in the options menu
game.registry.set('gameWidth', null);
game.registry.set('gameHeight', null);

window.onresize = function() {
	console.log('window resize:', window.innerWidth, window.innerHeight);
};


window._game = game;
window._gs = function() {
	return window._game.scene.getScenes()[0];
}
