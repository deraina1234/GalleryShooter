class Ability1 extends Phaser.Scene {
    constructor() {
        super("Ability1");
        this.my = {sprite: {}, text: {}};
    }

    preload() {

        this.load.setPath("./assets/");

        //font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.image("special", "lasershieldnice.png");


    }

    create() {
        let my = this.my;

        this.add.rectangle(
            game.config.width / 2,
            game.config.height / 2,
            game.config.width, 
            game.config.height,
            0x000000
        );
        this.add.bitmapText(250, 70, "rocketSquare", "wave shot:", 40);
        this.add.bitmapText(75 + 30, game.config.height / 4, "rocketSquare", "       press Q to shoot a special\nwave shot that can hit multiple\n              enemies in its path", 28);
        this.add.sprite(game.config.width / 2, 415, "special").setScale(1).setTint(0x4444aa);
        this.e = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );
        this.time.delayedCall(4000, () => {
            this.add.bitmapText(20, game.config.height - 50, "rocketSquare", "Press E to continue...", 24);
        });
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.e)){
            this.scene.start("LevelTwo");
        }
    }

}
