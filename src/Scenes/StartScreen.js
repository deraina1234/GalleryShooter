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
            0x000000
        );
        //pixel stars
        let stars = this.add.graphics();

        //spawn 119 stars randomly across the canvas
        for(let i = 0; i < 120; i++){
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);

            //make some stars white and some grey
            let color = Phaser.Math.Between(0, 1) === 0 ? 0xffffff : 0x777777;

            stars.fillStyle(color, 1);

            //some stars are 1x1 and some are 2x2
            let size = Phaser.Math.Between(1, 2);
            stars.fillRect(x, y, size, size);
        }

        this.movingShip = this.add.sprite(100, 450, "enemyShip");
        this.movingShip.setScale(0.5);
        this.movingShip.vx = 120;   
        this.movingShip.vy = 80;  

        this.movingShipTwo = this.add.sprite(700, 200, "enemyShip");
        this.movingShipTwo.setScale(0.5);
        this.movingShipTwo.vx = -120;   
        this.movingShipTwo.vy = 80;  

        this.movingShipThree = this.add.sprite(400, 200, "enemyShip");
        this.movingShipThree.setScale(0.5);
        this.movingShipThree.vx = -90;   
        this.movingShipThree.vy = 80;

        

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

        this.events.once("shutdown", () => {
            this.menuSound.stop();
            this.menuSound.destroy();
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
        let shipThree = this.movingShipThree
    
        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;

        shipTwo.x += shipTwo.vx * dt;
        shipTwo.y += shipTwo.vy * dt;

        shipThree.x += shipThree.vx * dt;
        shipThree.y += shipThree.vy * dt;

        if(ship.x > game.config.width){
            ship.x = 0;
        }
        if(ship.y > game.config.height){
            ship.y = 0;
        }
        if(shipTwo.x < 0){
            shipTwo.x = 700;
        }
        if(shipTwo.y > 650){
            shipTwo.y = 50;
        }
        if(shipThree.x < 0){
            shipThree.x = 700;
        }
        if(shipThree.y > 650){
            shipThree.y = 50;
        }
    
    }

}
