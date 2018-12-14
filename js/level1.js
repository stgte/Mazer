var NotScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function NotScene() {
        Phaser.Scene.call(this, {
            key: 'NotScene'
        });

    },

    preload: function () {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bullet', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.image('tile', 'assets/pipe.png');
    },
    create: function () {
        console.log('NotScene');
        this.scene.start('levelOne');
    }
});
var PlayerSet = new Phaser.Class({

    extends: Phaser.GameObjects.Sprite,

    initialize: function PlayerSet(scene, x, y, textue, frame, lifeX, damage, shot) {
        Phaser.GameObjecs.Sprite.call(this, scene, x, y, texture, frame)
        this.lifeX = 100;
        this.damage = damage;
        this.shot = shot;
        this.alive = true;
    },
    shoot: function (target) {
        target.takeDamage(this.damage);
    },
    takeDamage: function (damage) {
        this.lifeX -= damage;
        if (this.lifeX <= 0) {
            this.alive = false;
            this.scene.laungh('GameOver');
        }
    }
});


var EnemySet = new Phaser.Class({

    extends: Phaser.GameObjects.Sprite,

    initialize: function EnemySet(scene, x, y, textue, frame, lifeX, damage, shot) {
        Phaser.GameObjecs.Sprite.call(this, scene, x, y, texture, frame)
        this.lifeX = lifeX;
        this.damage = damage;
        this.shot = shot;
        this.alive = true;
    },
    shoot: function (target) {
        target.takeDamage(this.damage);
    },
    takeDamage: function (damage) {
        this.lifeX -= damage;
        if (this.lifeX <= 0) {
            this.alive = false;
            pool();
        }
    }
});

var LevelOne = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function LevelOne() {
        Phaser.Scene.call(this, {
            key: 'levelOne'
        });
    },
    create: function () {
        this.add.image(400, 300, 'sky');
    }

});

var GameOver = new Phaser.Class({
    extends: Phaser.Scene,

    initialize: function GameOver() {
        Phaser.Scene.call(this, {
            key: 'ameOver'
        });

    },
    create: function () {
        this.cameras.main.setBackgroundColor('#CE6A85');
    }


})

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
        }
    },
    scene: [NotScene, LevelOne]
};

var game = new Phaser.Game(config);
