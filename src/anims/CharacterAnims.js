import Phaser from 'phaser'

const createCharacterAnims = (anims) => {
    //add animations to main character sprite
    //idles
    anims.create({
        key:'faune-idle-down',
        frames: [{ key: 'faune', frame:'walk-down-3.png'}]
    })
    anims.create({
        key:'faune-idle-up',
        frames: [{ key: 'faune', frame:'walk-up-3.png'}]
    })
    anims.create({
        key:'faune-idle-side',
        frames: [{ key: 'faune', frame:'walk-side-3.png'}]
    })
    //run-down
    anims.create({
        key: 'faune-run-down',
        //generateFrameNames function can use a pattern to guess frame names
        frames: anims.generateFrameNames('faune',{start:1, end:8, prefix:'run-down-', suffix:'.png'}),
        repeat: -1,
        frameRate: 15
    })
    //run-up
    anims.create({
        key: 'faune-run-up',
        //generateFrameNames function can use a pattern to guess frame names
            frames: anims.generateFrameNames('faune',{start:1, end:8, prefix:'run-up-', suffix:'.png'}),
            repeat: -1,
            frameRate: 15
        })
    //run-side
    anims.create({
        key: 'faune-run-side',
        //generateFrameNames function can use a pattern to guess frame names
        frames: anims.generateFrameNames('faune',{start:1, end:8, prefix:'run-side-', suffix:'.png'}),
        repeat: -1,
        frameRate: 15
    })
}

export {
    createCharacterAnims
}