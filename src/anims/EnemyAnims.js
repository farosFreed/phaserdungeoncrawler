//import phaser for typing, may not need
import Phaser from 'phaser'


const createLizardAnims = (anims) => {
    //create lizard idle animation
    anims.create({
        key:'lizard-idle',
        frames: anims.generateFrameNames('lizard', {start:1, end:3, prefix:'lizard_m_idle_anim_f', suffix:'.png'}),
        repeat: -1,
        frameRate: 5
    })
    //create lizard run animation
    anims.create({
     key:'lizard-run',
     frames: anims.generateFrameNames('lizard', {start:1, end:3, prefix:'lizard_m_run_anim_f',suffix:'.png'}),
     repeat: -1,
     frameRate: 10
 })
}

export {
    createLizardAnims
}