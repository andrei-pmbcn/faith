/*
* @author Andrei Pambuccian
* @copyright 2021 Andrei Pambuccian
* @license {https://www.gnu.org/licenses/gpl-3.0.en.html|GPL3.0 license}
*/

import Phaser from 'phaser';
import mainMenu from './scenes/mainMenu.js';
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
game.registry.set('username', null);

// Set the width and height to be null, which means they match the
// window's height and width;
// [TODO] set these in the options menu
game.registry.set('gameWidth', null);
game.registry.set('gameHeight', null);

//[TODO] When setting resolution in the options menu, this resolution applies
// to both mobile and desktop versions; ideally, an option should be made
// to save for all devices, and the resolution should only save for the current
// device by default

/*
window.onresize = function() {
	console.log('window resize:', window.innerWidth, window.innerHeight);
};
*/

//[TODO] Webpack - include code only in debug / production version?
