class BossBattle extends Phaser.Scene {
    
    constructor() {
        super("BossBattle");

        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 5;
        
        this.myScore = 0;
        this.myHealth = 15;
    }

    init() {
    this.myScore = 0;
    this.myHealth = 15;

    this.my.sprite.bullet = [];

    this.gameStarted = false;
    }


    preload() {

        this.load.setPath("./assets/");
        this.load.image("player", "player_back.png");
        this.load.image("laser", "midnight_22.png");

        this.load.image("tower", "tower_10.png")
        this.load.image("tower2", "tower_10.png")
        this.load.image("tower3", "tower_10.png")

        this.load.image("stars", "starsbackground.webp")

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("laser_sect", "impactMetal_light_003.ogg")
        this.load.audio("music_bg", "magpiemusic-action-trailer-promo-rock-513687.mp3")
        this.load.audio("user_click", "click1.ogg")
        this.load.audio("shoot", "laserSmall_001.ogg")

    }

    create() {

        //Backround
        this.cameras.main.setBackgroundColor("#000000");

        let my = this.my;

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




    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

        


        if (this.myScore >= 150){
            this.bgMusic.stop();
            this.scene.start("YouWin");
        }

        if (this.myHealth <= 0){
            this.bgMusic.stop();
            this.scene.start("YouLose");
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

}