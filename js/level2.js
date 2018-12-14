var NotScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function NotScene() {
		Phaser.Scene.call(this, {
			key: 'NotScene'
		});

	},

	preload: function () {
		this.load.image('sky', 'assets/sky.png');
	},
	create: function () {
		this.scene.start('sceneB');
	}
});

var SceneB = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function SceneB() {
			Phaser.Scene.call(this, {
				key: 'sceneB'
			});
		},

	create: function () {
		console.log('SceneB');

		this.scene.start('sceneC');
	}

});

var SceneC = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function SceneC() {
			Phaser.Scene.call(this, {
				key: 'sceneC'
			});
		},

	create: function () {
		console.log('SceneC');

		this.scene.start('sceneD');
	}

});

var SceneD = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function SceneD() {
			Phaser.Scene.call(this, {
				key: 'sceneD'
			});
		},

	create: function () {
		console.log('SceneD');

		this.scene.start('levelOne');
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
	},
	update: function () {
		if (player.x > 740 && player.y > 370) {
			star.destroy();
			var text1 = this.add.text(300, 300, 'You won!', {
				font: '64px Arial'
			});
			this.input.on('pointerdown', function (pointer) {
				this.scene.start('startScene');

			}, this);

		}
	}

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
	scene: [NotScene, SceneB, SceneC, SceneD, LevelOne]
};

var game = new Phaser.Game(config);
