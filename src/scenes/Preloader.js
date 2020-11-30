import Phase from 'phaser'

export default class Preloader extends Phaser.Scene {
    constructor()
    {
        super('preloader') //unique key for scene
    }

    preload(){
        //load stage
        this.load.image('tiles', 'tiles/dungeon-tiles-extruded.png')
        this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon-01.json')
        //load character
        this.load.atlas('faune', 'character/fauna.png', 'character/fauna.json')
    }

    create(){
        //run the game scene after this scene has preloaded
        this.scene.start('game')
    }
}