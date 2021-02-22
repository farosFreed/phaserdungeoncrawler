import Phaser from "phaser";
//import { Boot, Battle } from "./scenes";

const config = {
	type: Phaser.AUTO,
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: [Preloader, Game, GameUI],
	scale: {
        mode: Phaser.Scale.FIT,
        parent: 'gameNode',
        autoCenter: Phaser.Scale.FIT,
        width: window.innerWidth,
        height: window.innerHeight
    }
}

/*
export default {
  parent: "gameNode",
  pixelArt: true,
  roundPixels: true
};
*/

//config.type = Phaser.AUTO;
//config.scene = [Boot, Battle];
/*config.scale = {
    mode: Phaser.Scale.FIT,
    parent: 'gameNode',
    autoCenter: Phaser.Scale.FIT,
    width: window.innerWidth,
    height: window.innerHeight
};*/

const uiRoot = document.getElementById('uiRoot');
for (const eventName of ['mouseup', 'mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']) {
    uiRoot.addEventListener(eventName, e => e.stopPropagation());
}

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars