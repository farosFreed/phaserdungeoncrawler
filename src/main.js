import Phaser from 'phaser'

//scenes
import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

const config = {
	type: Phaser.AUTO,
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scene: [Preloader, Game],
	scale: {
		zoom:2
	}
}

export default new Phaser.Game(config)
