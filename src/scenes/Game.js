import Phaser from 'phaser'

import { createLizardAnims } from '../anims/EnemyAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'

import { debugDraw } from '../utils/debug'
import Lizard from '../enemies/lizard'
import Faune from '../characters/Faune'

import { sceneEvents } from '../events/eventCenter'


export default class Game extends Phaser.Scene
{
	constructor()
	{
        super('game')
        this.cursors = undefined
        this.faune = undefined
        //store a reference to the player-lzard collider so we can destroy it elsewhere when player dies
        this.playerLizardCollider = undefined

	}

	preload()
    {
        //get the cursors
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
        //set enemy and character anims early to avoid errors
        createLizardAnims(this.anims)
        createCharacterAnims(this.anims)

        //show gameUI in this scene instead of after
        //could also use this.scene.get but then scenes are more blended
        this.scene.run('game-ui')
        //we will use events to pass info between scenes instead

       const map = this.make.tilemap({key: 'dungeon'})
       //the first value in addTilesetImage must match the name of the tileset in the Tiled UI. 
       //its displayed in the right menu above the tile selection
       //NOT necessarily same as value above
       //IMPORTANT: add the 1,2 spacing and padding to work with tile-extruder
       const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

       //'Ground' / 'Walls' are the name of the layers containing the content we want
       //in the Tiled UI
       map.createStaticLayer('Ground', tileset)
       const wallsLayer = map.createStaticLayer('Walls',tileset)
       //set walls up for collisions with player
       wallsLayer.setCollisionByProperty({collides: true})
        //Create main character, edit bounding box, and add character animations
        this.faune = this.add.faune(128,128,'faune')
        
        //set collisions between character and walls
        this.physics.add.collider(this.faune, wallsLayer)
        //have camera follow
        this.cameras.main.startFollow(this.faune,true)
        //start idle facing screen
        //this.faune.anims.play('faune-idle-down')

       //create a group of lizards
       const lizards = this.physics.add.group({
           classType:Lizard,
           //set onCollide to true for each new lizard
           //this allows our lizards to react to collision events
           createCallback: (item) => {
               const LizItem = item
               LizItem.body.onCollide = true
           }
        })
       this.physics.add.collider(lizards, wallsLayer)
       lizards.get(256,128, 'lizard')
       lizards.get(106,228, 'lizard')
        
       //add a collider between lizard and character
       //handlePlayerLizardCollision on collision, nothing on process, context = this sprite
       //(since there are multiple lizard sprites, we only want to trigger a reaction with the 1 that collided)
       this.playerLizardCollider = this.physics.add.collider(lizards, this.faune, this.handlePlayerLizardCollision, undefined, this)

        //debug draw test
       //debugDraw(wallsLayer, this)
    }

    handlePlayerLizardCollision(obj1, obj2){
        const lizard = obj2

        const dx = this.faune.x - lizard.x
        const dy = this.faune.y - lizard.y

        const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(200)
        this.faune.handleDamage(dir)

        //TODO : best practice is have seperate full with all event names as a const
        //so they dont get lost! (such as player-health-changed)

        //emit event and get player health
        sceneEvents.emit('player-health-changed', this.faune.health)

        //if player dies, destroy the player-lizard colliders
        if (this.faune.health <= 0){
            this.playerLizardCollider.destroy()
        }
    }

    //tutorials passes the t: number, dt: number values to this function
    //these are default phaser args
    update()
    {
        if (this.faune){
            //pass cursor keys to character
            this.faune.update(this.cursors)
        }
    }
}
