class StartScreen extends Phaser.Scene {
    constructor() {
        super("startScreen");

        this.my = {sprite: {}, text: {}};


    }

    preload() {
        this.load.setPath("./assets/");

        //images
        this.load.image("enemyShip", "shipYellow_manned.png");

        //font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");


        //audios
        this.load.audio("menuMusic", "energysound-powerful-percussion-513717.mp3")
        
       
    }

    create() {
        let my = this.my;

        this.add.rectangle(
            game.config.width / 2,
            game.config.height / 2,
            game.config.width, 
            game.config.height,
            0x6a0dad
        );

        this.movingShip = this.add.sprite(100, 450, "enemyShip");
        this.movingShip.setScale(0.5);
        this.movingShip.vx = 120;   
        this.movingShip.vy = 80;  

        this.movingShipTwo = this.add.sprite(700, 450, "enemyShip");
        this.movingShipTwo.setScale(0.5);
        this.movingShipTwo.vx = -120;   
        this.movingShipTwo.vy = 80;  

        

        this.add.bitmapText(
            game.config.width / 2, 
            100,
            "rocketSquare",
            "Survive the Dystopia",
            48,
        ).setOrigin(0.5,0.5);

        this.makeButton(game.config.width / 2, 250, "START", () => {
            
            this.scene.start("LevelOne");
            
        });

        this.makeButton(game.config.width / 2, 300, "CONTROLS", () => {
            this.scene.start("controls")
        });

        this.menuSound = this.sound.add("menuMusic");
        this.menuSound.play({loop: true});

        
        this.events.on("shutdown", () => {
            this.menuSound.stop();
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
        let dt = delta / 1000;
        let ship = this.movingShip;
        let shipTwo = this.movingShipTwo;
    
        // Move the ship by its velocity
        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;

        shipTwo.x += shipTwo.vx * dt;
        shipTwo.y += shipTwo.vy * dt;

        if(ship.x > game.config.width){
            ship.x = 0;
        }
        if(ship.y > game.config.height){
            ship.y = 0;
        }
        if(shipTwo.x < 0){
            shipTwo.x = 700;
        }
        if(shipTwo.y > 0){
            shipTwo.y = 50;
        }
    
    }

}
