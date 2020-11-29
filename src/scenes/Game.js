import Phaser from 'phaser'
//import { isThrowStatement } from 'typescript'

import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene
{
    //typescript
    //private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    //ES2019 JS private vars
    //#cursors = Phaser.Type
    //private cursor !: Phaser.Types.Input.Keyboard.CursorKeys
    //faune



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
        //this.add.image(0,0,'tiles')

       const map = this.make.tilemap({key: 'dungeon'})
       //the first value in addTilesetImage must match the name of the tileset in the Tiled UI. 
       //its displayed in the right menu above the tile selection
       //NOT necessarily same as value above
       const tileset = map.addTilesetImage('dungeon', 'tiles')

        //'Ground' / 'Walls' are the name of the layers containing the content we want
        //in the Tiled UI
       map.createStaticLayer('Ground', tileset)
       const wallsLayer = map.createStaticLayer('Walls',tileset)
       //set walls up for collisions with player
       wallsLayer.setCollisionByProperty({collides: true})


       //Add character
        this.faune = this.physics.add.sprite(128,128,'faune','walk-down-3.png')
        this.faune.body.setSize(this.faune.width/2, this.faune.height * .8)
        //add animations to character sprite
        //idles
        this.anims.create({
            key:'faune-idle-down',
            frames: [{ key: 'faune', frame:'walk-down-3.png'}]
        })
        this.anims.create({
            key:'faune-idle-up',
            frames: [{ key: 'faune', frame:'walk-up-3.png'}]
        })
        this.anims.create({
            key:'faune-idle-side',
            frames: [{ key: 'faune', frame:'walk-side-3.png'}]
        })
        //run-down
        this.anims.create({
            key: 'faune-run-down',
            //generateFrameNames function can use a pattern to guess frame names
            frames: this.anims.generateFrameNames('faune',{start:1, end:8, prefix:'run-down-', suffix:'.png'}),
            repeat: -1,
            frameRate: 15
        })
        //run-up
        this.anims.create({
            key: 'faune-run-up',
            //generateFrameNames function can use a pattern to guess frame names
            frames: this.anims.generateFrameNames('faune',{start:1, end:8, prefix:'run-up-', suffix:'.png'}),
            repeat: -1,
            frameRate: 15
        })
        //run-side
        this.anims.create({
            key: 'faune-run-side',
            //generateFrameNames function can use a pattern to guess frame names
            frames: this.anims.generateFrameNames('faune',{start:1, end:8, prefix:'run-side-', suffix:'.png'}),
            repeat: -1,
            frameRate: 15
        })
        //set collisions between character and walls
        this.physics.add.collider(this.faune, wallsLayer)
        //have camera follow
        this.cameras.main.startFollow(this.faune,true)
        //start idle facing screen
        this.faune.anims.play('faune-idle-down')

       //debug draw?
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
