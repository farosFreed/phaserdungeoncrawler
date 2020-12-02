import Phaser from 'phaser'
import { isThrowStatement } from 'typescript'
import Chest from '../items/Chest'


//character states
const HealthState = ['IDLE','DAMAGE','DEAD']

export default class Faune extends Phaser.Physics.Arcade.Sprite
{
    #currentState = HealthState[0] //set currentState to 'IDLE'
    #damageTime = 0 //currently not damaged

    #_health = 3 //initial health which will be kept private
    #_coins = 0 //inital coins, also private

    #knives = undefined
    #activeChest = undefined

    get health(){
        return this.#_health //getter for health
    }

    constructor(scene,x,y,texture,frame){
        super(scene,x,y,texture,frame)

        //start idle facing screen
        this.anims.play('faune-idle-down')


    }
    //set chest to open
    setChest(chest){
        this.#activeChest = chest
        console.dir(this.#activeChest)
    }
    //make weapons in scene group
    setKnives(knives){
        this.#knives = knives
    }

    //throw knives / use weapon
    throwKnife(){

        //if no knives, do nothing
        if (!this.#knives){
            return
        }
        
        const parts = this.anims.currentAnim.key.split('-')
        const direction = parts[2]

        const vec = new Phaser.Math.Vector2(0,0) //make a vector object

        switch (direction){
            case 'up':
                vec.y = -1 //set vector direction up
                break
            case 'down':
                vec.y = 1 //set vector direction down
                break
            case 'side':
                if (this.scaleX < 0){ //scaleX is 1 when facing right, -1 when left
                    vec.x = -1 //set vector direction left
                } else {
                    vec.x = 1 //set vector direction right
                }
                break
        }

        const angle = vec.angle() //gives us the vector angle in radians
        //because we are inside the character object we can spawn the knife at the character with this.x, this.y
        const knife = this.#knives.get(this.x, this.y, 'knife',)

        knife.setActive(true) //setActive so we can killAndHide later
        knife.setVisible(true)

        knife.setRotation(angle)

        knife.x += vec.x * 16
        knife.y += vec.y * 16

        knife.setVelocity(vec.x * 300, vec.y * 300)
        
    }

    //handle damage events
    handleDamage(dir){

        //if I'm already being damaged or already dead dont keep murdering me
        if (this.#_health <= 0 || this.#currentState == HealthState[1]){
            return
        }

        //otherwise, damage animations!
        
        //lose 1 heart
        --this.#_health

        //if this sets health to 0
        if (this.#_health <= 0){
            //die
            this.#currentState = HealthState[2] //set currentState to 'DEAD'
            this.anims.play('faune-faint')
            this.setVelocity(0,0)

        } else { //else show damage, knockback
            this.setVelocity(dir.x,dir.y)
            this.setTint(0xff0000)
            this.#currentState = HealthState[1] //set currentState to 'DAMAGE'
            this.#damageTime = 0 //reset damage timer
        }
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

        //if damaged or dead, no moving
        if (this.#currentState === HealthState[1] || this.#currentState === HealthState[2]){
            return
        }
        //if cursors and character aren't loaded, stop
        if (!cursors){
            return
        }

        //if spacebar
        if (Phaser.Input.Keyboard.JustDown(cursors.space)){
            //and if active chest
            if (this.#activeChest){
                const coins = this.#activeChest.open() //open it
                this.#_coins += coins
                console.log(coins)
            //otherwise 
            } else {
                this.throwKnife() //throw knife
            }
            return
        }

        //player movement with arrow keys
        const speed = 100

        //const leftDown = 
        //const rightDown = 
        //const upDown = 
        //const downDown = 
        
        if (cursors.left.isDown){
            this.setVelocity(-speed, 0)
            this.anims.play('faune-run-side',true)
            this.scaleX  = -1
            //not the same as this.faune.setOffset which did not have desired effects,was buggy
            this.body.offset.x = 24

            this.#activeChest = undefined //remove activeChests
        }
        else if(cursors.right.isDown){
            this.setVelocity(speed,0)
            this.anims.play('faune-run-side',true)
            this.scaleX  = 1
            this.body.offset.x = 8

            this.#activeChest = undefined //remove activeChests
        }
        else if(cursors.down.isDown){
            this.setVelocity(0,speed)
            this.anims.play('faune-run-down',true)
            this.#activeChest = undefined //remove activeChests
        }
        else if(cursors.up.isDown){
            this.setVelocity(0,-speed)
            this.anims.play('faune-run-up',true)
            this.#activeChest = undefined //remove activeChests
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