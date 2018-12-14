var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;
var lastFired = 0;
var speed;
var bullets;
var stats;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bullet', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.image('tile', 'assets/pipe.png');
}

function fire(x, y) {

}

function create() {
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function Bullet(scene) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

                this.speed = Phaser.Math.GetSpeed(400, 1);
            },

        fire: function (x, y) {
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta) {
            this.y -= this.speed * delta;

            if (this.y < -50) {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });


    class PlayerSet extends Phaser.GameObjects.Sprite {

        constructor(scene, x, y, texture, frame, lifeX, damage, shot) {
            super(scene, x, y);

            this.setTexture(texture);
            this.setPosition(x, y);
            this.setFrame(4);
            this.lifeX = 100;
            this.damage = damage;
            this.shot = shot;
            this.alive = true;
        }

        preUpdate(time, delta) {
            super.preUpdate(time, delta);

            this.rotation += 0.01;
        }

        shoot(target) {
            target.takeDamage(this.damage);
        }
        takeDamage(damage) {
            this.lifeX -= damage;
            if (this.lifeX <= 0) {
                this.alive = false;
                this.scene.laungh('GameOver');
            }
        }

    }

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 10,
        runChildUpdate: true
    });
    this.add.image(400, 300, 'sky');
    const maze = [
       [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, , 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
   ];




    player = this.physics.add.sprite(100, 450, 'dude');

    star = this.physics.add.sprite(450, 450, 'star');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{
            key: 'dude',
            frame: 4
        }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    for (i = 0; i < 600 / 50; i++) {
        for (p = 0; p < 800 / 50; p++) {
            if (maze[i][p] == 1) {
                var tile = this.physics.add.sprite(p * 50, i * 50, 'tile');
                tile.body.setImmovable(true);
                this.physics.add.collider(player, tile);
            }
        }
    }



}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);

        player.anims.play('up', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);

        player.anims.play('down', true);
    } else {
        player.setVelocityX(0);
        player.setVelocityY(0);

        player.anims.play('turn');
    }

    if (cursors.space.isDown) {
        var bullet = bullets.get();

        if (bullet) {
            bullet.fire(player.x, player.y);

        }
    }
}
