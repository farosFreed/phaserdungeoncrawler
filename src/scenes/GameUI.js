import Phaser from 'phaser'
//listen for player health change
import { sceneEvents } from '../events/eventCenter'

export default class GameUI extends Phaser.Scene
{
    constructor(){
        super('game-ui')
        this.hearts = undefined
    }

    create()
    {
        //super('game-ui')

        //coins ui
        this.add.image(6, 26, 'treasure', 'coin_anim_f0.png')
        const coinsLabel = this.add.text(12,20,'0')
        sceneEvents.on('player-coins-changed', (coins) => {
            coinsLabel.text = coins.toLocaleString()
        })

        //heart ui
        this.hearts = this.add.group()

        this.hearts.createMultiple({
            key:'ui-heart-full',
            setXY: {
                x:10,
                y:10,
                stepX: 16
            },
            quantity: 3
        })

        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)
        //cleanup event listeners
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
            sceneEvents.off('player-coins-changed', undefined, this)
        })
    }

    handlePlayerHealthChanged(health)
    {
        //because hearts is a group we must use children.each 
        //takes a grouop object and an index

        this.hearts.children.each((go, idx) => {
            const heart = go //typescript: go as Phaser.GameObjects.Image

            if (idx < health){
                heart.setTexture('ui-heart-full') 
            }
            else {
                heart.setTexture('ui-heart-empty')
            }
        })

    }
}