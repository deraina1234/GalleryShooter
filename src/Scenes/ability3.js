class Ability3 extends Phaser.Scene {
    constructor() {
        super("Ability3");
        this.my = {sprite: {}, text: {}};
    }

    preload() {

        this.load.setPath("./assets/");

        //font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.image("laser", "midnight_22.png");


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
        this.add.bitmapText(70, 60, "rocketSquare", "Boss Battle", 80);
        this.add.bitmapText(250, 170, "rocketSquare", "mega shot:", 40);
        this.add.bitmapText(75 + 20, (game.config.height / 4) + 100, "rocketSquare", "    press V to shoot 3 mega shots\n                   to deal 5 damage", 28);
                                                                                                         
        this.my.sprite.bullets = [];
        const bulletSpacing = 90;
        const bulletCount = 3
        
        for (let i = 0; i < bulletCount; i++) {
            const bullet = this.add.sprite(-bulletSpacing * 2 + i * bulletSpacing, game.config.height - 100, "laser").setScale(2).setRotation(Math.PI / 2);
            this.my.sprite.bullets.push(bullet);
        }

        this.bulletSpeed = 200;

        this.e = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );
        this.time.delayedCall(4000, () => {
            this.add.bitmapText(20, game.config.height - 50, "rocketSquare", "Press E to continue...", 24);
        });
    }

    update() {

        for (let bullet of this.my.sprite.bullets) {
            bullet.x += this.bulletSpeed * (this.game.loop.delta / 1000);

            if (bullet.x > game.config.width + 50) {
                bullet.x = -50;
            }
        }


        if(Phaser.Input.Keyboard.JustDown(this.e)){
            this.scene.start("BossBattle");
        }
    }

}
