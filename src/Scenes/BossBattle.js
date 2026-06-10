class BossBattle extends Phaser.Scene {
    
    constructor() {
        super("BossBattle");

        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 5;
        this.myHealth = 15;
        this.bossHealth = 15;
        
    }

    init() {
        this.myHealth = 15;
        this.bossHealth = 30;

        this.my.sprite.bullet = [];

        this.gameStarted = false;

    }


    preload() {

        this.load.setPath("./assets/");
        this.load.image("player", "player_back.png");
        this.load.image("enemyShip", "shipBeige_manned.png");
        this.load.image("laser", "midnight_22.png");

        this.load.image("tower", "pieceGreen_single09.png")

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("laser_sect", "impactMetal_light_003.ogg")
        this.load.audio("music_bg", "magpiemusic-action-trailer-promo-rock-513687.mp3")
        this.load.audio("user_click", "click1.ogg")
        this.load.audio("shoot", "laserSmall_001.ogg")
        this.mySound = this.sound.add("laser_sect");

    }

    create() {

        //Backround
        this.cameras.main.setBackgroundColor("#000000");

        let my = this.my;


        this.overlay = this.add.rectangle(

            game.config.width / 2,
            game.config.height / 2, 
            game.config.width,
            game.config.height,
            0xffffff,
            0.8

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

        //countdown:
        this.countdownText = this.add.bitmapText(game.config.width / 2, game.config.height / 2, "rocketSquare", "3");

        this.countdownText.setOrigin(0.5,0.5);

        this.time.delayedCall(1000, () => { this.countdownText.setText("2"); });
        this.time.delayedCall(2000, () => { this.countdownText.setText("1"); });
        this.time.delayedCall(3000, () => {this.overlay.setVisible(false); this.countdownText.setVisible(false); this.gameStarted = true;});


        my.sprite.player = this.add.sprite((game.config.width/2), game.config.height - 35, "player");
        my.sprite.player.setScale(1.00);

        my.sprite.enemyShip = this.add.sprite(game.config.width/2, 125, "enemyShip");
        my.sprite.enemyShip.setScale(1.25);
        my.sprite.enemyShip.scorePoints = 150;

        my.sprite.tower = this.add.sprite((0.9 * game.config.width), (0.85 * game.config.height) + 40, "tower");
        my.sprite.tower.setScale(2.5);

        this.mySound = this.sound.add("laser_sect");
        this.shootSound = this.sound.add("shoot");
        this.deathSound = this.sound.add("death");

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.playerSpeed = 350;
        this.bulletSpeed = 275;


        my.text.bossHealth = this.add.bitmapText(457, 0, "rocketSquare", "Boss Health " + this.bossHealth);
        my.text.health = this.add.bitmapText(500, 40, "rocketSquare",    "Health " + this.myHealth + "/15");

        //background audio
        this.bgMusic = this.sound.add("music_bg");
        this.bgMusic.play({loop: true, volume: 0.5});

        this.events.once("shutdown", () => {
            this.bgMusic.stop();
            this.bgMusic.destroy();
        });




    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

        if(!this.gameStarted){
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.pauseGame();
        }
        if (this.paused) {
            return;
        }

         //movement and shooting mechanics
        if (this.left.isDown) {
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed * dt;
            }
        }

        if (this.right.isDown) {
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed * dt;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.shootSound.play({volume: 0.5});
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "laser").setScale(0.75)
                );
            }
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));


        if (this.myScore >= 150){
            this.bgMusic.stop();
            this.scene.start("YouWin");
        }

        if (this.myHealth <= 0){
            this.bgMusic.stop();
            this.scene.start("YouLose");
        }
        let enemyShip = my.sprite.enemyShip;

        for (let bullet of my.sprite.bullet) {
            if (enemyShip.visible && this.collides(enemyShip, bullet, 0.8)) {
                bullet.y = -100;
                this.mySound.play({volume: 0.5});
                this.bossHealth -= 1;
                this.updateBossHealth();
            }
        }
        if(this.bossHealth <= 0){
            this.bgMusic.stop();
            this.scene.start("YouWin");
        }
        if(this.myHealth <= 0){
            this.bgMusic.stop();
            this.scene.start("YouLose");
        }


        // bullets motion
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }



    }

    collides(a, b, shrink = 1) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2) * shrink) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2) * shrink) return false;
        return true;
    }

    updatehealth(){
        let my = this.my;
        my.text.health.setText("Health " + this.myHealth + "/20");
    }

    updateBossHealth(){
        let my = this.my;
        my.text.bossHealth.setText("Boss Health " + this.bossHealth);
    }

    pauseGame() {
        if (this.paused) return;
        this.paused = true;
    
        this.overlay.setVisible(true);
    
        this.title = this.add.bitmapText(game.config.width / 2, 200, "rocketSquare", "PAUSED", 48).setOrigin(0.5, 0.5);
    
        this.continueGame = this.add.bitmapText(game.config.width / 2, 290, "rocketSquare", "CONTINUE", 32).setOrigin(0.5, 0.5);
        this.continueGame.setInteractive();
        this.continueGame.on("pointerover", () => this.continueGame.setScale(1.2));
        this.continueGame.on("pointerout", () => this.continueGame.setScale(1));
        this.continueGame.on("pointerdown", () => this.resumeGame());
    
        this.returnMenu = this.add.bitmapText(game.config.width / 2, 350, "rocketSquare", "MAIN MENU", 32).setOrigin(0.5, 0.5);
        this.returnMenu.setInteractive();
        this.returnMenu.on("pointerover", () => this.returnMenu.setScale(1.2));
        this.returnMenu.on("pointerout", () => this.returnMenu.setScale(1));

        this.returnMenu.on("pointerdown", () => {
            this.bgMusic.stop();
            this.scene.start("startScreen");
        });
    }

    resumeGame() {
        this.paused = false;
        this.overlay.setVisible(false);
    
        this.title.destroy();
        this.continueGame.destroy();
        this.returnMenu.destroy();
    }

}