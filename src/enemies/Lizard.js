import Phaser from 'phaser'
import { isThisTypeNode } from 'typescript'

const UP = 0
const DOWN = 1
const LEFT = 2
const RIGHT = 3

const directions = {
    UP:0,
    DOWN:1,
    LEFT:2,
    RIGHT:3
}

export default class Lizard extends Phaser.Physics.Arcade.Sprite 
{   
    #direction = directions.RIGHT
    #moveEvent = undefined

    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame)

        this.anims.play('lizard-idle')

        scene.physics.world.on('tilecollide', this.tileCollision, this)
        //every 2 secs check for random move direction change
        this.#moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                //get a random number 0-3 and lookup the corresponding direction
                const newDirection = Object.keys(directions).find(key => directions[key] === Phaser.Math.Between(0,3))
                //console.log('collision' + newDirection)
                this.#direction = directions[newDirection]
            },
            loop: true
        })
    }

    //change direction on tile collision
    tileCollision(go, tile) {
        //if we're not the one that collided with the tile, do nothing
        if (go !== this)
        {
            return
        }

        //get a random number 0-3 and lookup the corresponding direction
        const newDirection = Object.keys(directions).find(key => directions[key] === Phaser.Math.Between(0,3))
        //console.log('collision' + newDirection)
        this.#direction = directions[newDirection]
    }

    preUpdate(t, dt){
        //call the parent function first, let it do its thing
        super.preUpdate(t, dt)

        //custom logic to place lizard enemies
        switch (this.#direction)
        {
            case this.#direction = directions.UP:
                this.setVelocity(0,-50)
                break

            case this.#direction = directions.DOWN:
                this.setVelocity(0,50)
                break

            case this.#direction = directions.LEFT:
                this.setVelocity(-50,0)
                break

            case this.#direction = directions.RIGHT:
                this.setVelocity(50,0)
                break
        }
    }
    //customize default destroy event to clean up #moveEvent timers
    //parent goes last in this case since it might destroy something we need
    destroy(fromScene){
        this.#moveEvent.destroy()
        super.destroy(fromScene)
    }
}