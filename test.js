var NotScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function NotScene() {
		Phaser.Scene.call(this, {
			key: 'NotScene'
		});

	},

	preload: function () {
		this.load.image('sky', 'js/assets/sky.png');
		this.load.spritesheet('enemy', 'js/assets/spritesheet.png', {
			frameWidth: 26,
			frameHeight: 17
		});
		this.load.image('lvl1', 'js/assets/lvl1.png');
		this.load.image('lvl2', 'js/assets/lvl2.png');
		this.load.image('lvl3', 'js/assets/lvl3.png');
		this.load.image('lvl4', 'js/assets/lvl4.png');
		this.load.image('lvl5', 'js/assets/lvl5.png');
		this.load.image('ground', 'js/assets/platform.png');
		this.load.image('star1', 'js/assets/star1.png');
		this.load.image('star', 'js/assets/star.png');
		this.load.image('bullet', 'js/assets/bomb.png');
		this.load.image('block', 'js/assets/pipe.png');
		this.load.image('target', 'js/assets/bullet.png');
		this.load.image('start', 'js/assets/cartoon-rainbow-with-clouds-background-thumb38.jpg');
		this.load.spritesheet('dude', 'js/assets/dude.png', {
			frameWidth: 30,
			frameHeight: 45
		});
		this.load.image('tile', 'js/assets/tilesgreen.png');
		this.load.audio('jump', 'js/assets/audio/jump.wav');
		this.load.audio('score', 'js/assets/audio/score.wav');
		this.load.audio('loser', 'js/assets/audio/Conga3.wav');
	},
	create: function () {
		this.scene.start('startScene');
	}
});

var Bullet = new Phaser.Class({

	Extends: Phaser.GameObjects.Image,

	initialize:

		// Bullet Constructor
		function Bullet(scene) {
			Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
			this.speed = 1;
			this.born = 0;
			this.direction = 0;
			this.xSpeed = 0;
			this.ySpeed = 0;
			this.setSize(12, 12, true);
		},

	// Fires a bullet from the player to the reticle
	fire: function (shooter, target) {
		this.setPosition(shooter.x, shooter.y); // Initial position
		this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

		// Calculate X and y velocity of bullet to moves it from shooter to target
		if (target.y >= this.y) {
			this.xSpeed = this.speed * Math.sin(this.direction);
			this.ySpeed = this.speed * Math.cos(this.direction);
		} else {
			this.xSpeed = -this.speed * Math.sin(this.direction);
			this.ySpeed = -this.speed * Math.cos(this.direction);
		}

		this.rotation = shooter.rotation; // angle bullet with shooters rotation
		this.born = 0; // Time since new bullet spawned
	},

	// Updates the position of the bullet each cycle
	update: function (time, delta) {
		this.x += this.xSpeed * delta;
		this.y += this.ySpeed * delta;
		this.born += delta;
		if (this.born > 1800) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

});

var StartScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function StartScene() {
		Phaser.Scene.call(this, {
			key: 'startScene'
		});
	},
	create: function () {
		this.add.image(400, 300, 'sky');


		var blocks = this.add.group({
			key: 'block',
			repeat: 139,
			setScale: {
				x: 0,
				y: 0
			}
		});

		Phaser.Actions.GridAlign(blocks.getChildren(), {
			width: 14,
			cellWidth: 50,
			cellHeight: 50,
			x: 70,
			y: 60
		});

		var _this = this;

		var i = 0;

		blocks.children.iterate(function (child) {

			_this.tweens.add({
				targets: child,
				scaleX: 1,
				scaleY: 1,
				angle: 180,
				_ease: 'Sine.easeInOut',
				ease: 'Power2',
				duration: 1000,
				delay: i * 50,
				repeat: -1,
				yoyo: true,
				hold: 1000,
				repeatDelay: 1000
			});

			i++;

			if (i % 14 === 0) {
				i = 0;
			}

		});
		var graphics = this.add.graphics();
		text = this.add.text(400, 300, "çlick to start..", {
			fontFamily: "Arial Black",
			fontSize: 74,
			color: "#c51b7d"
		});
		text.setStroke('#de77ae', 16);


		text.setOrigin(0.5);



		graphics.beginPath();

		graphics.moveTo(400, 0);
		graphics.lineTo(400, 600);

		graphics.moveTo(0, 300);
		graphics.lineTo(800, 300);

		graphics.strokePath();

		graphics.closePath();


		this.input.on('pointerdown', function (pointer) {
			this.scene.launch('levelOne');
		}, this);
	},
	update: function () {

		text.rotation += 0.01;
	}
});

class PlayerSet extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "dude");
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.body.setCollideWorldBounds(true);
		this.body.setBounce(0.2);
		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.scene.anims.create({
			key: 'left',
			frames: this.scene.anims.generateFrameNumbers('dude', {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});

		this.scene.anims.create({
			key: 'turn',
			frames: [{
				key: 'dude',
				frame: 4
		        }],
			frameRate: 20
		});

		this.scene.anims.create({
			key: 'right',
			frames: this.scene.anims.generateFrameNumbers('dude', {
				start: 5,
				end: 8
			}),
			frameRate: 10,
			repeat: -1
		});
		this.bulletGroup = this.scene.add.group();
		for (var i = 0; i < 1000; i++) {
			this.bulletGroup.add(new Bullet(this.scene, 0, 0));
		}
	}
	update() {
		if (this.cursors.left.isDown) {
			this.body.setVelocityX(-160);

			this.anims.play('left', true);
		} else if (this.cursors.right.isDown) {
			this.body.setVelocityX(160);

			this.anims.play('right', true);
		} else if (this.cursors.up.isDown) {
			this.body.setVelocityY(-160);

			this.anims.play('up', true);
		} else if (this.cursors.down.isDown) {
			this.body.setVelocityY(160);

			this.anims.play('down', true);
		} else {
			this.body.setVelocityX(0);
			this.body.setVelocityY(0);

			this.anims.play('turn');
		}




	}
}
var LevelOne = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function LevelOne() {
		Phaser.Scene.call(this, {
			key: 'levelOne'
		});
	},
	create: function () {

		this.add.image(400, 300, 'sky');
		var player = new PlayerSet(this, 12.5, 500);


		var playerGroup = this.add.group({
			runChildUpdate: true
		});
		playerGroup.add(player);
		var passSound = this.sound.add('score');





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
        [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
   ];
		for (i = 0; i < 600 / 50; i++) {
			for (p = 0; p < 800 / 50; p++) {
				if (maze[i][p] == 1) {
					var tile = this.physics.add.sprite(p * 50, i * 50, 'tile');
					tile.body.setImmovable(true);
					this.physics.add.collider(player, tile);
				}
			}
		}
		star = this.physics.add.sprite(750, 375, 'star');
		this.physics.add.overlap(player, star, function (player, star) {
			star.destroy();
			passSound.play();
			var text1 = this.add.text(300, 300, 'You won!', {
				font: '64px Arial'
			});
			this.input.on('pointerdown', function (pointer) {
				this.scene.start('levelTwo');

			}, this);
		}, null, this);

	},



});

var Enemies = new Phaser.Class({

	Extends: Phaser.Physics.Arcade.Sprite,

	initialize:

		function Enemies(scene, x, y, width, height, speed) {
			Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'enemy');

			//  This is the path the sprite will follow
			this.path = new Phaser.Curves.Ellipse(x, y, width, height);
			this.pathIndex = 0;
			this.pathSpeed = speed;
			this.pathVector = new Phaser.Math.Vector2();

			this.path.getPoint(0, this.pathVector);

			this.setPosition(this.pathVector.x, this.pathVector.y);
		},

	preUpdate: function (time, delta) {
		this.anims.update(time, delta);

		this.path.getPoint(this.pathIndex, this.pathVector);

		this.setPosition(this.pathVector.x, this.pathVector.y);

		this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
	},


});

var LevelTwo = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function LevelOne() {
		Phaser.Scene.call(this, {
			key: 'levelTwo'
		});
	},
	create: function () {
		this.add.image(400, 300, 'sky');
		playerBullets = this.physics.add.group({
			classType: Bullet,
			runChildUpdate: true
		});
		reticle = this.physics.add.sprite(62.5, 500, 'target');
		var player = new PlayerSet(this, 12.5, 500);
		console.log(player);

		var playerGroup = this.add.group({
			runChildUpdate: true
		});
		playerGroup.add(player);

		var enemy = this.physics.add.group();
		var jumpSound = this.sound.add('jump');
		var passSound = this.sound.add('score');
		var loseSound = this.sound.add('loser');



		enemy.add(new Enemies(this, 650, 55, 10, 10, 0.005), true);

		this.physics.add.overlap(player, enemy, function (player, enemy) {
			player.destroy();
			loseSound.play()
			var text1 = this.add.text(300, 300, 'Loser!', {
				font: '64px Arial'
			});
			this.input.on('pointerdown', function (pointer) {
				this.scene.launch('startScene');

			}, this);

		}, null, this);








		const maze = [
       [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

   ];
		var tileGroup = this.add.group();
		for (i = 0; i < 600 / 50; i++) {
			for (p = 0; p < 800 / 50; p++) {
				if (maze[i][p] == 1) {
					var tile = this.physics.add.sprite(p * 50, i * 50, 'tile');
					tileGroup.add(tile);
					tile.body.setImmovable(true);
					this.physics.add.collider(player, tile);

				}
			}
		}


		this.input.on('pointerdown', function (pointer, time, lastFired) {
			if (player.active === false)
				return;

			// Get bullet from bullets group
			var bullet = playerBullets.get().setActive(true).setVisible(true);
			this.physics.add.overlap(playerBullets, tileGroup, function (playerBullets, tileGroup) {
				bullet.destroy();
			}, null, this);

			if (bullet) {
				bullet.fire(player, reticle);
				jumpSound.play();



			}
		}, this);

		// Pointer lock will only work after mousedown
		game.canvas.addEventListener('mousedown', function () {
			game.input.mouse.requestPointerLock();
		});

		// Exit pointer lock when Q or escape (by default) is pressed.
		this.input.keyboard.on('keydown_Q', function (event) {
			if (game.input.mouse.locked)
				game.input.mouse.releasePointerLock();
		}, 0, this);

		// Move reticle upon locked pointer move
		this.input.on('pointermove', function (pointer) {
			if (this.input.mouse.locked) {
				reticle.x += pointer.movementX;
				reticle.y += pointer.movementY;
			}
		}, this);
		star = this.physics.add.sprite(750, 355, 'star');
		this.physics.add.overlap(player, star, function (player, star) {
			star.destroy();
			var text1 = this.add.text(300, 300, 'You won!', {
				font: '64px Arial'
			});
			this.input.on('pointerdown', function (pointer) {
				this.scene.start('startScene');

			}, this);
		}, null, this);
		this.physics.add.overlap(playerBullets, enemy, function (bullet, enemy) {
			enemy.destroy();

		}, null, this);

	},




});


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
	scene: [NotScene, StartScene, LevelOne, LevelTwo]
};

var game = new Phaser.Game(config);
