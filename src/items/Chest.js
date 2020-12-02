import Phaser from 'phaser'

export default class Chest extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)

        this.anims.play('chest-closed')
    }

    open(){
        //if chest is already open, get nothing
        if (this.anims.currentAnim.key !== 'chest-closed')
        {
            return 0
        }
        //otherwise play chest open and get 50-200 coins
        this.anims.play('chest-open')
        return Phaser.Math.Between(50,200)
    }
}