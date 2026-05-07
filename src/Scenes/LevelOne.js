class LevelOne extends Phaser.Scene {
    constructor() {
        super("LevelOne");

        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 5;
        
        this.myScore = 0;
        this.myHealth = 15;
    }

    preload() {

        this.load.setPath("./assets/");
        this.load.image("player", "player_back.png");
        this.load.image("laser", "midnight_22.png");
        this.load.image("enemyShip", "shipYellow_manned.png");
        this.load.image("tower", "tower_10.png")
        this.load.image("tower2", "tower_10.png")
        this.load.image("tower3", "tower_10.png")
        this.load.image("deathResult", "laserPink_groundBurst.png");

        this.load.image("stars", "starsbackground.webp")

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("laser_sect", "impactMetal_light_003.ogg")
        this.load.audio("music_bg", "magpiemusic-action-trailer-promo-rock-513687.mp3")
        this.load.audio("user_click", "click1.ogg")
        this.load.audio("shoot", "laserSmall_001.ogg")
        this.load.audio("death", "jingles_PIZZI11.ogg")
    }

    create() {
        let my = this.my;

        this.add.image(game.config.width / 2, game.config.height / 2, "stars").setDisplaySize(game.config.width, game.config.height);

        this.gameStarted = false;

        this.overlay = this.add.rectangle(

            game.config.width / 2,
            game.config.height / 2, 
            game.config.width,
            game.config.height,
            0xffffff,
            0.8

        );

        // countdown text so the player doesn't immediately have to start playing

        this.countdownText = this.add.bitmapText(game.config.width / 2, game.config.height / 2, "rocketSquare", "3");

        this.countdownText.setOrigin(0.5,0.5);

        this.time.delayedCall(1000, () => { this.countdownText.setText("2"); });
        this.time.delayedCall(2000, () => { this.countdownText.setText("1"); });
        this.time.delayedCall(3000, () => {this.overlay.setVisible(false); this.countdownText.setVisible(false); this.gameStarted = true;});

       
        // all objects on screen, adjusting scale, and placing them
        my.sprite.player = this.add.sprite((game.config.width/2), game.config.height - 35, "player");
        my.sprite.player.setScale(1.00);

        my.sprite.tower = this.add.sprite((0.9 * game.config.width), (0.85 * game.config.height), "tower");
        my.sprite.tower.setScale(1.75);
        my.sprite.tower = this.add.sprite((0.92 * game.config.width), (0.75 * game.config.height), "tower3");
        my.sprite.tower.setScale(1.75);
        my.sprite.tower = this.add.sprite((0.85 * game.config.width), (0.8 * game.config.height), "tower2");
        my.sprite.tower.setScale(1.75);
        
        this.enemyShipStartY = 80;
        my.sprite.enemyShip = this.add.sprite(Math.random() * game.config.width/2, this.enemyShipStartY, "enemyShip");
        my.sprite.enemyShip.setScale(0.50);
        my.sprite.enemyShip.scorePoints = 15;

        let dx = my.sprite.tower.x - my.sprite.enemyShip.x
        let dy = my.sprite.tower.y - my.sprite.enemyShip.y

        let distance = Math.sqrt(dx * dx + dy * dy);
        let speed = 75;

        my.sprite.enemyShip.vx = (dx / distance) * speed;
        my.sprite.enemyShip.vy = (dy / distance) * speed;

        //sounds
        this.mySound = this.sound.add("laser_sect");
        this.shootSound = this.sound.add("shoot");
        this.deathSound = this.sound.add("death");

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 350;
        this.bulletSpeed = 275;


        my.text.score = this.add.bitmapText(500, 0, "rocketSquare", "Score " + this.myScore);
        my.text.health = this.add.bitmapText(580, 40, "rocketSquare", "Health " + this.myHealth + "/15");

        //background audio
        this.bgMusic = this.sound.add("music_bg");
        this.bgMusic.play({loop: true, volume: 0.5});

        

    }


    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

        if(!this.gameStarted){
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

        // collision chekcing
        for (let bullet of my.sprite.bullet) {
            if (enemyShip.visible && this.collides(enemyShip, bullet, 0.5)) {
                this.explosion = this.add.sprite(enemyShip.x, enemyShip.y, "deathResult").setScale(0.25).play("explosion");
                // clear the bullets out
                bullet.y = -100;
                enemyShip.visible = false;
                enemyShip.x = -100;

                // update score
                this.myScore += enemyShip.scorePoints;
                this.updateScore();
                this.mySound.play({volume: 0.5});

                // new ship appear
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

        // bullets motion
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }


        // stopping music when moving to different scenes
        if (this.myScore >= 100){
            this.bgMusic.stop();
            this.scene.start("LevelTwo");
        }

        if (this.myHealth <= 0){
            this.bgMusic.stop();
            this.scene.start("YouLose");
        }

    }


    // A center-radius AABB collision check (from audio practice in class assignment)
    collides(a, b, shrink = 1) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2) * shrink) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2) * shrink) return false;
        return true;
    }

    // update score and health functions
    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    updatehealth(){
        let my = this.my;
        my.text.health.setText("Health " + this.myHealth + "/15");
    }

}
