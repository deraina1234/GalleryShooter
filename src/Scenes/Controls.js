class Controls extends Phaser.Scene { //This is Anthony
    constructor() {
        super("controls");

        this.my = {sprite: {}, text: {}};


    }

    preload() {

        this.load.setPath("./assets/");
        //images
        this.load.image("enemyShip", "shipYellow_manned.png");

        //font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("menuMusic", "energysound-powerful-percussion-513717.mp3")


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


        this.menuSound = this.sound.add("menuMusic");
        this.menuSound.play({loop: true});

        this.add.bitmapText(
            game.config.width / 2, 
            70,
            "rocketSquare",
            "DEFEND YOUR TOWER",
            48,
        ).setOrigin(0.5,0.5);
        this.add.bitmapText(
            game.config.width / 2, 
            180,
            "rocketSquare",
            "A -> Left\nD -> Right",
            48,
        ).setOrigin(0.5,0.5);
        this.add.bitmapText(
            game.config.width / 2, 
            260,
            "rocketSquare",
            "Space -> Shoot",
            48,
        ).setOrigin(0.5,0.5);
        this.add.bitmapText(
            game.config.width / 2, 
            400,
            "rocketSquare",
            "Level2 -> Q -> Special Ability1\nLevel3 -> V -> Special Ability2\nBoss Fight -> T -> Special Ability3",
            30,
        ).setOrigin(0.5,0.5);

        this.makeButton(game.config.width / 2, 500, "Back to Menu", () => {
            this.scene.start("startScreen");
            
        });

        


    }

    makeButton(x, y, text, onClick) {
        const button = this.add.bitmapText(x, y, "rocketSquare", text, 28);
        button.setOrigin(0.5, 0.5);
        button.setInteractive();
    
        button.on("pointerdown", () => {
            onClick();
        });

        
    }

   


    update(time, delta) {

    }

}
