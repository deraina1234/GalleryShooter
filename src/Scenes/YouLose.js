class YouLose extends Phaser.Scene {
    constructor() {
        super("YouLose");

        this.my = {sprite: {}, text: {}};


    }

    preload() {

        this.load.setPath("./assets/");

        //font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");


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

   


    update() {
    }

}
