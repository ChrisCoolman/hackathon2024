let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#00FF7B',
    canvas: document.getElementById("gameCanvas"),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let w, a, s, d, e;
let player;
let fireball;
let fire;
let erel;
let enemyfire;

let enemyhealth = 50;

let phealth = 100;
let phealthtext;

let playerDirection;

let worldScale = 4;

function preload() {
    //this.load.image("guy", "assets/imgs/stick_guy.png");
    this.load.spritesheet("guy", 'assets/imgs/fire_bender.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image("fireball", "assets/imgs/fireball.png");
    this.load.image("stickguy", "assets/imgs/fireball.png");
}

function create() {
    // add keyboard input
    w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    // add player
    player = this.physics.add.sprite(400, 200, "guy");

    phealthtext = this.add.text(16, 16, 'Player Health: 100', { fontSize: '32px', fill: '#000' });

    //colide
    player.setCollideWorldBounds(true);

    //this.cameras.main.setZoom(1.25);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('guy', { start: 8, end: 13 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'guy', frame: 7 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('guy', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    // fireball
    fireball = this.physics.add.group({ key: 'fireball' });

    enemies = this.physics.add.group({ key: "stickguy" });

    createEnemy.call(this, 100, 200);
}

function update() {
    if (w.isDown) {
        player.setVelocityY(-160);
        playerDirection = "up";
        player.anims.play('turn');
    }
    else if (d.isDown) {
        player.setVelocityX(160);
        playerDirection = "right";
        player.anims.play('right');
    }
    else if (a.isDown) {
        player.setVelocityX(-160);
        playerDirection = "left";
        player.anims.play('left');
    }
    else if (s.isDown) {
        player.setVelocityY(160);
        playerDirection = "down";
        player.anims.play('turn');
    }
    else {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
    }

    if (e.isDown && erel) {
        // create fireball
        let fire = fireball.create(player.x, player.y, "fireball").setScale(worldScale).refreshBody();
        if (playerDirection == "up") {
            fire.setVelocityY(-500);
        }
        else if (playerDirection == "down") {
            fire.setVelocityY(500);
        }
        else if (playerDirection == "left") {
            fire.setVelocityX(-500);
        }
        else if (playerDirection == "right") {
            fire.setVelocityX(500);
        }
        erel = false;
    }
    else if (e.isUp) {
        erel = true;
    }

    if (fire && (fire.x > 800 || fire.x < 0 || fire.y > 600 || fire.y < 0)) {
        fire.disableBody(true, true);
    }

}

function createEnemy(x, y) {
    // Create enemy sprite
    let enemy = enemies.create(x, y, 'stickguy');
    this.physics.add.overlap(enemy, fire, killenemy, null, this);
    // Schedule enemy to shoot
    this.time.addEvent({
        delay: 2000,
        loop: true,
        callback: function() {
            enemyShoot.call(this, enemy);
        },
        callbackScope: this
    });
}
function enemyShoot(enemy) {
    // Create fireball
    enemyfire = fireball.create(enemy.x, enemy.y, 'fireball');
    this.physics.add.overlap(player, enemyfire, damage, null, this);
    enemyfire.setVelocityX(400);
}


function damage() {
    phealth -= 1;
    phealthtext.setText("Player Health: " + phealth);

    if (phealth <= 0) {
        phealthtext.update("Game Over");

        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');
    }
}

function killenemy() {
    enemyhealth--;
    if (enemyhealth < 0) {
        enemy.disableBody(true, true);
    }
}
