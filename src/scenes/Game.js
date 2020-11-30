import Phaser from 'phaser'

import { createLizardAnims } from '../anims/EnemyAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'

import { debugDraw } from '../utils/debug'
import Lizard from '../enemies/lizard'

export default class Game extends Phaser.Scene
{
	constructor()
	{
        super('game')
        this.cursors = undefined
        this.faune = undefined

	}

	preload()
    {
        //get the cursors
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
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
        this.faune = this.physics.add.sprite(128,128,'faune','walk-down-3.png')
        this.faune.body.setSize(this.faune.width/2, this.faune.height * .8)
        createCharacterAnims(this.anims)
        
        //set collisions between character and walls
        this.physics.add.collider(this.faune, wallsLayer)
        //have camera follow
        this.cameras.main.startFollow(this.faune,true)
        //start idle facing screen
        this.faune.anims.play('faune-idle-down')

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
       createLizardAnims(this.anims)
       this.physics.add.collider(lizards, wallsLayer)
       lizards.get(256,128, 'lizard')
        
       //const lizard = this.physics.add.sprite(256,128,'lizard','lizard_m_idle_anim_f0.png')
       //this.physics.add.collider(lizards, wallsLayer)
       
    //debug draw test
       //debugDraw(wallsLayer, this)
    }
    //tutorials passes the t: number, dt: number values to this function
    //these are default phaser args
    update()
    {
        //if cursors and character aren't loaded, stop
        if (!this.cursors || !this.faune){
            return
        }

        //player movement with arrow keys
        const speed = 100
        if (this.cursors.left.isDown){
            this.faune.setVelocity(-speed, 0)
            this.faune.anims.play('faune-run-side',true)
            this.faune.scaleX  = -1
            //not the same as this.faune.setOffset which did not habe desired effects,was buggy
            this.faune.body.offset.x = 24
        }
        else if(this.cursors.right.isDown){
            this.faune.setVelocity(speed,0)
            this.faune.anims.play('faune-run-side',true)
            this.faune.scaleX  = 1
            this.faune.body.offset.x = 8
        }
        else if(this.cursors.down.isDown){
            this.faune.setVelocity(0,speed)
            this.faune.anims.play('faune-run-down',true)
        }
        else if(this.cursors.up.isDown){
            this.faune.setVelocity(0,-speed)
            this.faune.anims.play('faune-run-up',true)
        } 
        else {
            //if no cursor, stop movement and idle
            
            //get the current animation key
            const parts = this.faune.anims.currentAnim.key.split('-')
            //parts now has faune, run, direction
            //so overwrite the run with idle and rejoin to get the correct key
            parts[1] = 'idle'
            this.faune.setVelocity(0,0)
            this.faune.anims.play(parts.join('-'))
        }

        //more?
    }
}
