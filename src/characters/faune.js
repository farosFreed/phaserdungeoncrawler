import Phaser from 'phaser'
//import { isThisTypeNode } from 'typescript';

//character states
const HealthState = ['IDLE','DAMAGE']

export default class Faune extends Phaser.Physics.Arcade.Sprite{
    #currentState = HealthState[0] //set currentState to 'IDLE'
    #damageTime = 0 //currently not damaged

    constructor(scene,x,y,texture,frame){
        super(scene,x,y,texture,frame)

        //start idle facing screen
        this.anims.play('faune-idle-down')
    }

    //handle damage events
    handleDamage(dir){
        //if I'm already being damaged dont stack
        if (this.#currentState === HealthState[1]){
            return
        }
        //otherwise, damage!
        this.setVelocity(dir.x,dir.y)
        this.setTint(0xff0000)
        this.#currentState = HealthState[1] //set currentState to 'DAMAGE'
        this.#damageTime = 0 //reset damage timer
    }

    preUpdate(t,dt){
        //let super do its thing!
        super.preUpdate(t,dt)

        switch(this.#currentState)
        {
            case HealthState[0]:
                break

            case HealthState[1]:
                this.#damageTime += dt //accumulator
             if (this.#damageTime >= 250){
                this.#currentState = HealthState[0] //get healthy again
                this.setTint(0xffffff)
                this.#damageTime = 0
             }
             break
        }
    }

    //animate character based on cursors
    update(cursors){
        //let super do its things
        super.update(cursors)

        //if damaged, no moving
        if (this.#currentState === HealthState[1]){
            return
        }
        //if cursors and character aren't loaded, stop
        if (!cursors){
            return
        }

        //player movement with arrow keys
        const speed = 100
        if (cursors.left.isDown){
            this.setVelocity(-speed, 0)
            this.anims.play('faune-run-side',true)
            this.scaleX  = -1
            //not the same as this.faune.setOffset which did not habe desired effects,was buggy
            this.body.offset.x = 24
        }
        else if(cursors.right.isDown){
            this.setVelocity(speed,0)
            this.anims.play('faune-run-side',true)
            this.scaleX  = 1
            this.body.offset.x = 8
        }
        else if(cursors.down.isDown){
            this.setVelocity(0,speed)
            this.anims.play('faune-run-down',true)
        }
        else if(cursors.up.isDown){
            this.setVelocity(0,-speed)
            this.anims.play('faune-run-up',true)
        } 
        else {
            //if no cursor, stop movement and idle

            //get the current animation key
            const parts = this.anims.currentAnim.key.split('-')
            //parts now has faune, run, direction
            //so overwrite the run with idle and rejoin to get the correct key
            parts[1] = 'idle'
            this.setVelocity(0,0)
            this.anims.play(parts.join('-'))
        }
    }
}

//use gameobjectfactory so we can this.add.faune to the scene instead of new Faune
//could also maybe make this a normal sprite?

//register faune key with gameobjectfactory
Phaser.GameObjects.GameObjectFactory.register('faune', function(x,y,texture,frame){
    const self = this

    //get the logic from the physics/arcade/factory/sprite class in phaser
    var sprite = new Faune(self.scene,x,y,texture,frame)
    
    //remove sys
    self.displayList.add(sprite)
    self.updateList.add(sprite)

    self.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    //now we can change our body size!
    sprite.body.setSize(sprite.width/2, sprite.height * .8)

    return sprite
})