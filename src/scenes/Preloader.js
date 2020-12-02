import Phase from 'phaser'
import { isThisTypeNode } from 'typescript'

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
        this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')
        this.load.image('ui-heart-full', 'ui/ui_heart_full.png')
        //load weapons
        //we will rotate art based on direction - phaser likes right pointing default images!!
        this.load.image('knife', 'weapons/weapon_knife.png')
        //load enemy lizard
        this.load.atlas('lizard', 'enemies/lizard.png', 'enemies/lizard.json')

    }

    create(){
        //run the game scene after this scene has preloaded
        this.scene.start('game')
    }
}