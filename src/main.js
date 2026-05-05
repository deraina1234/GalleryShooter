"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    width: 800,
    height: 600,
    scene: [StartScreen, LevelOne, Controls, LevelTwo, YouLose, YouWin]
}


const game = new Phaser.Game(config);