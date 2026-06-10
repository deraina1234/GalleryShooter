class LevelTwo extends Phaser.Scene {
    constructor() {
        super("LevelTwo");

        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 5;

        this.specialUsed = 0;
        this.maxSpecial = 3;

        this.my.sprite.enemyBullet = [];
        
        this.myScore = 0;
        this.myHealth = 20;

        this.shield = null;
    }

    init() {
        this.myScore = 0;
        this.myHealth = 20;

        this.my.sprite.bullet = [];
        this.my.sprite.enemyBullet = [];

        this.specialUsed = 0;

        this.gameStarted = false;
        this.paused = false;

        this.shield = null;
    }

    preload() {

        this.load.setPath("./assets/");

        // all sprites loaded
        this.load.image("player", "player_back.png");
        this.load.image("laser", "midnight_22.png");
        this.load.image("special", "lasershieldnice.png");
        this.load.image("enemyLaser", "laserRed02.png");
        this.load.image("enemyShip", "shipYellow_manned.png");
        this.load.image("enemyTwo", "shipBlue_manned.png");
        this.load.image("tower", "pieceGreen_single09.png");
        this.load.image("tower2", "pieceGreen_single09.png");
        this.load.image("deathResult", "laserPink_groundBurst.png");

        //font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        //audios
        this.load.audio("laser_sect", "impactMetal_light_003.ogg");
        this.load.audio("music_bg", "magpiemusic-action-trailer-promo-rock-513687.mp3");
        this.load.audio("user_click", "click1.ogg");
        this.load.audio("shoot", "laserSmall_001.ogg");
        this.load.audio("death", "jingles_PIZZI11.ogg");
        this.load.audio("specialOut", "freesound_community-wrong-47985.mp3");
    }

    create() {
        let my = this.my;

        //make sure the background photo i have fits to the display size
        //this.add.image(game.config.width / 2, game.config.height / 2, "stars").setDisplaySize(game.config.width, game.config.height);

        this.gameStarted = false;

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

        this.countdownText = this.add.bitmapText(game.config.width / 2, game.config.height / 2, "rocketSquare", "3");

        this.countdownText.setOrigin(0.5,0.5);

        this.time.delayedCall(1000, () => { this.countdownText.setText("2"); });
        this.time.delayedCall(2000, () => { this.countdownText.setText("1"); });
        this.time.delayedCall(3000, () => {this.overlay.setVisible(false); this.countdownText.setVisible(false); this.gameStarted = true;});

       
        // all objects on screen, adjusting scale, and placing them
        my.sprite.player = this.add.sprite((game.config.width/2), game.config.height - 35, "player");
        my.sprite.player.setScale(1.00);


        //right tower
        my.sprite.tower = this.add.sprite((0.9 * game.config.width), (0.85 * game.config.height) + 40, "tower");
        my.sprite.tower.setScale(2.5);

        //left tower
        my.sprite.towerTwo = this.add.sprite((0.1 * game.config.width), (0.85 * game.config.height) + 40, "tower2");
        my.sprite.towerTwo.setScale(2.5);

        //enemy1
        this.enemyShipStartY = 80;
        my.sprite.enemyShip = this.add.sprite(Math.random() * game.config.width/2, this.enemyShipStartY, "enemyShip");
        my.sprite.enemyShip.setScale(0.50);
        my.sprite.enemyShip.scorePoints = 15;

        let dx = my.sprite.tower.x - my.sprite.enemyShip.x
        let dy = my.sprite.tower.y - my.sprite.enemyShip.y

        let distance = Math.sqrt(dx * dx + dy * dy);
        let speed = 95;

        my.sprite.enemyShip.vx = (dx / distance) * speed;
        my.sprite.enemyShip.vy = (dy / distance) * speed;

        //enemy2
        my.sprite.enemyTwo = this.add.sprite(game.config.width/2 + Math.random() * game.config.width/2, this.enemyShipStartY, "enemyTwo");
        my.sprite.enemyTwo.setScale(0.50);
        my.sprite.enemyTwo.scorePoints = 15;

        my.sprite.enemyTwo.targetTower = Math.random() < 0.5 ? my.sprite.towerTwo : my.sprite.tower;

        let dx2 = my.sprite.enemyTwo.targetTower.x - my.sprite.enemyTwo.x;
        let dy2 = my.sprite.enemyTwo.targetTower.y - my.sprite.enemyTwo.y;

        let distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        my.sprite.enemyTwo.vx = (dx2 / distance2) * speed;
        my.sprite.enemyTwo.vy = (dy2 / distance2) * speed;


        //sounds
        this.mySound = this.sound.add("laser_sect");
        this.shootSound = this.sound.add("shoot");
        this.deathSound = this.sound.add("death");
        this.specialOutSound = this.sound.add("specialOut");

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.q = this.input.keyboard.addKey("Q");
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        this.playerSpeed = 350;
        this.bulletSpeed = 275;

        //text
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);
        my.text.health = this.add.bitmapText(500, 40, "rocketSquare", "Health " + this.myHealth + "/20");
        my.text.special = this.add.bitmapText(520, 80, "rocketSquare", "Special " + (this.maxSpecial - this.specialUsed) + "/" + this.maxSpecial);

        //background audio
        this.bgMusic = this.sound.add("music_bg");
        this.bgMusic.play({loop: true, volume: 0.2});

        this.events.once("shutdown", () => {
            this.bgMusic.stop();
            this.bgMusic.destroy();
        });


        // every three seconds the enemy will shoot a laser
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => {
                if(!this.gameStarted || !my.sprite.enemyTwo.visible){
                    return;
                }

                let bullet = this.add.sprite(my.sprite.enemyTwo.x, my.sprite.enemyTwo.y, "enemyLaser");
                bullet.setScale(1.5);
                let targetTower;

                if(Math.random() < 0.5){
                    targetTower = my.sprite.towerTwo;  // left tower
                } 
                else{
                    targetTower = my.sprite.tower;     // right tower
                }

                let dx = targetTower.x - my.sprite.enemyTwo.x;
                let dy = targetTower.y - my.sprite.enemyTwo.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let speed = 250;

                bullet.vx = (dx / distance) * speed;
                bullet.vy = (dy / distance) * speed;

                bullet.rotation = Math.atan2(dy, dx) + Math.PI / 2;

                bullet.targetTower = targetTower;

                my.sprite.enemyBullet.push(bullet);
                
            }
        })
        

    }


    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

        if(!this.gameStarted){
            return;
        }

        if (this.myHealth <= 0){
            this.bgMusic.stop();
            this.scene.start("YouLose");
        }

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

        if (Phaser.Input.Keyboard.JustDown(this.q)) {
            if (this.specialUsed < this.maxSpecial) {
                this.shootSound.play({volume: 0.5});
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-50, "special").setScale(1.3).setTint(0x4444aa)
                );
                this.specialUsed += 1;
                this.updateSpecial();
            }  else {
                this.specialOutSound.play({volume: 2.0});
            }
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        let enemyShip = my.sprite.enemyShip;
            if (enemyShip.visible) {
                enemyShip.x += enemyShip.vx * dt;
                enemyShip.y += enemyShip.vy * dt;
                
                enemyShip.x += Math.sin(time / 200) * 1.5;
                
                
                if (enemyShip.y > game.config.height || enemyShip.x > game.config.width) {
                    enemyShip.x = Math.random() * (game.config.width/2);
                    enemyShip.y = 80;

                    let dx = my.sprite.tower.x - enemyShip.x
                    let dy = my.sprite.tower.y - enemyShip.y

                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let speed = 75;

                    enemyShip.vx = (dx / distance) * speed;
                    enemyShip.vy = (dy / distance) * speed;
         }}

         let enemyTwo = my.sprite.enemyTwo;
            if (enemyTwo.visible) {
                enemyTwo.x += enemyTwo.vx * dt;
                enemyTwo.y += enemyTwo.vy * dt;
                
                enemyTwo.x += Math.sin(time / 200) * 1.5;
                
                
                if (enemyTwo.y > game.config.height || enemyTwo.x > game.config.width) {
                    enemyTwo.x = Math.random() * game.config.width;
                    enemyTwo.y = 80;

                    enemyTwo.targetTower = Math.random() < 0.5 ? my.sprite.towerTwo : my.sprite.tower;

                    let dx = enemyTwo.targetTower.x - enemyTwo.x;
                    let dy = enemyTwo.targetTower.y - enemyTwo.y;

                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let speed = 95;

                    enemyTwo.vx = (dx / distance) * speed;
                    enemyTwo.vy = (dy / distance) * speed;
         }}

        if (enemyShip.visible && this.collides(enemyShip, my.sprite.tower)){


            this.myScore -= 10;
            this.updateScore();

            this.myHealth -= 1;
            this.updatehealth();

            this.deathSound.play({volume: 2.0});

            enemyShip.x = Math.random() * (game.config.width/2);
                    enemyShip.y = 80;

                    let dx = my.sprite.tower.x - enemyShip.x
                    let dy = my.sprite.tower.y - enemyShip.y

                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let speed = 75;

                    enemyShip.vx = (dx / distance) * speed;
                    enemyShip.vy = (dy / distance) * speed;
        }
        if (enemyTwo.visible && this.collides(enemyTwo, enemyTwo.targetTower)){
            this.myScore -= 10;
            this.updateScore();

            this.myHealth -= 1;
            this.updatehealth();

            this.deathSound.play({volume: 2.0});

            enemyTwo.x = Math.random() * game.config.width;
            enemyTwo.y = 80;

            enemyTwo.targetTower = Math.random() < 0.5 ? my.sprite.towerTwo : my.sprite.tower;

            let dx = enemyTwo.targetTower.x - enemyTwo.x;
            let dy = enemyTwo.targetTower.y - enemyTwo.y;

            let distance = Math.sqrt(dx * dx + dy * dy);
            let speed = 95;

            enemyTwo.vx = (dx / distance) * speed;
            enemyTwo.vy = (dy / distance) * speed;
        }

        // Check for collision with the enemyShip
        // Check for collision with the enemyShip
        for (let bullet of my.sprite.bullet) {
            if (enemyTwo.visible && this.collides(enemyTwo, bullet, 0.5)) {
                this.explosion = this.add.sprite(enemyTwo.x, enemyTwo.y, "deathResult").setScale(0.25).play("explosion");
                // clear bullets
                bullet.y = -100;
                enemyTwo.visible = false;
                enemyTwo.x = -100;
                // update score
                this.myScore += enemyTwo.scorePoints;
                this.updateScore();
                this.mySound.play({volume: 0.5});

                // spawn next enemy ship
                this.time.delayedCall(200, () => {
                    this.explosion.destroy();

                    let h = this.my.sprite.enemyTwo;
                    h.visible = true;
                    
                    enemyTwo.x = Math.random() * game.config.width;
                    enemyTwo.y = 80;

                    enemyTwo.targetTower = Math.random() < 0.5 ? my.sprite.towerTwo : my.sprite.tower;

                    let dx = enemyTwo.targetTower.x - enemyTwo.x;
                    let dy = enemyTwo.targetTower.y - enemyTwo.y;

                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let speed = 95;

                    enemyTwo.vx = (dx / distance) * speed;
                    enemyTwo.vy = (dy / distance) * speed;
                   
                }, this);
            }
        }
        for (let bullet of my.sprite.bullet) {
            if (enemyShip.visible && this.collides(enemyShip, bullet, 0.5)) {
                this.explosion = this.add.sprite(enemyShip.x, enemyShip.y, "deathResult").setScale(0.25).play("explosion");
                // clear bullets
                bullet.y = -100;
                enemyShip.visible = false;
                enemyShip.x = -100;
                // update score
                this.myScore += enemyShip.scorePoints;
                this.updateScore();
                this.mySound.play({volume: 0.5});

                // next enemyship spawn
                this.time.delayedCall(200, () => {
                    this.explosion.destroy();

                    let h = this.my.sprite.enemyShip;
                    h.visible = true;
                    
                    enemyShip.x = Math.random() * (game.config.width/2);
                    enemyShip.y = 80;

                    let dx = my.sprite.tower.x - enemyShip.x
                    let dy = my.sprite.tower.y - enemyShip.y

                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let speed = 75;

                    enemyShip.vx = (dx / distance) * speed;
                    enemyShip.vy = (dy / distance) * speed;
                   
                }, this);
            }
        }

        // bullet motion
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }


        my.sprite.enemyBullet = my.sprite.enemyBullet.filter((bullet) => {
            bullet.x += bullet.vx * dt;
            bullet.y += bullet.vy * dt;

        
            if (this.collides(bullet, bullet.targetTower)) {
                this.myScore -= 10;
                this.updateScore();
                this.myHealth -= 1;
                this.updatehealth();
                this.deathSound.play({volume: 2.0});
                bullet.destroy();
                return false;
            }
        
            if (bullet.y > game.config.height || bullet.x < 0 || bullet.x > game.config.width) {
                bullet.destroy();
                return false;
            }
        
            return true;
        });


        if (this.myScore >= 150){
            this.bgMusic.stop();
            this.scene.start("YouWin");
        }

    }


    // A center-radius AABB collision check from audio practice in class assignment
    collides(a, b, shrink = 1) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2) * shrink) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2) * shrink) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    updatehealth(){
        let my = this.my;
        my.text.health.setText("Health " + this.myHealth + "/20");
    }

    updateSpecial(){
        let my = this.my;
        my.text.special.setText("Special " + (this.maxSpecial - this.specialUsed) + "/" + this.maxSpecial);
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
