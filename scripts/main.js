let BootScene = new Phaser.Class({
 
	Extends: Phaser.Scene,

	initialize:

	function BootScene ()
	{
			Phaser.Scene.call(this, { key: 'BootScene' });
	},

	preload: function ()
	{
		// map tiles
		this.load.image('tiles', 'assets/map/spritesheet.png');

		// map in json format
		this.load.tilemapTiledJSON('map', 'assets/map/map.json');
		
		// our two characters
		this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
	},

	create: function ()
	{
			this.scene.start('WorldScene');
	}
});

let WorldScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function WorldScene ()
	{
			Phaser.Scene.call(this, { key: 'WorldScene' });
	},
	preload: function ()
	{
			
	},
	create: function ()
	{
		let map = this.make.tilemap({ key: 'map' });
		let tiles = map.addTilesetImage('spritesheet', 'tiles');
        
		let grass = map.createStaticLayer('Grass', tiles, 0, 0);
		let obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
		obstacles.setCollisionByExclusion([-1]);

		this.player = this.physics.add.sprite(50, 100, 'player', 6);

		this.physics.world.bounds.width = map.widthInPixels;
		this.physics.world.bounds.height = map.heightInPixels;
		this.player.setCollideWorldBounds(true);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
				this.cameras.main.roundPixels = true;
				
		//  animation with key 'left', we don't need left and right as we will use one and flip the sprite
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
			frameRate: 10,
			repeat: -1
	});
	
	// animation with key 'right'
	this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
			frameRate: 10,
			repeat: -1
	});
	this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
			frameRate: 10,
			repeat: -1
	});
	this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
			frameRate: 10,
			repeat: -1
	});


	//obstacle collision
	this.physics.add.collider(this.player, obstacles);

	//enemy location zones
	this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);            
        }        
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
	},

	onMeetEnemy: function(player, zone) { 
		       // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
				zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);  // shake the world
				this.cameras.main.flash(900);    
				this.cameras.main.shake(600);    
        this.cameras.main.fade(900);    
		// start battle
			},

	update: function (time, delta)
{
	this.player.body.setVelocity(0);
 
        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }
 
        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
				}  
				
				
				//player animation direction
				if (this.cursors.left.isDown)
        {
						this.player.anims.play('left', true);
						this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
						this.player.anims.play('right', true);
						this.player.flipX = false;

        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
}
});

let config = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 320,
	height: 240,
	zoom: 2,
	pixelArt: true,
	physics: {
			default: 'arcade',
			arcade: {
					gravity: { y: 0 },
					debug: true

			}
	},
	scene: [
			BootScene,
			WorldScene
	]
};
let game = new Phaser.Game(config);