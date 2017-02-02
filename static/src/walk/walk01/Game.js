/* jshint browser:true */
// create BasicGame Class
BasicGame = {

};

// create Game function in BasicGame
BasicGame.Game = function (game) {
};

// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(false, true);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },

    preload: function () {

        // Here we load the assets required for our preloader (in this case a 
        // background and a loading bar)
        // this.load.image('logo', 'asset/phaser.png');
        this.load.atlas('player', 'static/src/walk/walk01/asset/p1_walk.png', 'static/src/walk/walk01/asset/p1_walk.json');
        this.load.tilemap('MyTilemap', 'static/src/walk/walk01/asset/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('MyTiles', 'static/src/walk/walk01/asset/tilesheet_complete.png');
        this.load.image('greenJewel', 'static/src/walk/walk01/asset/Items/greenJewel.png');
    },

    create: function () {
        // Add logo to the center of the stage
        // this.logo = this.add.sprite(
        //    this.world.centerX, // (centerX, centerY) is the center coordination
        //    this.world.centerY,
        //    'logo');
        // Set the anchor to the center of the sprite
        // this.logo.anchor.setTo(0.5, 0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.map = this.game.add.tilemap('MyTilemap');
        this.map.addTilesetImage('tilesheet_complete', 'MyTiles');

        this.layer = this.map.createLayer('terrain');
        this.map.setCollisionBetween(1, 100, true, 'terrain');
        this.layer.resizeWorld();
        this.layer.wrap = true;

        this.game.physics.arcade.enable(this.layer);

        this.greenJewel = this.game.add.sprite(0, 0, 'greenJewel');

        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')

        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('run');
        this.player.animations.play('run', 15, true);


        // this.game.physics.arcade.collide(this.player, this.layer);

        // this.map.setCollisionBetween(1, 10000, true, "collision");

        // this.text = this.add.text(32, 32, 'cursor', { fill: '#ffffff' });
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function(){
        this.game.physics.arcade.collide(this.player, this.layer);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('run');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('run');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && (this.player.body.onFloor() || this.player.body.touching.down))
        {
            this.player.body.velocity.y = -350;
        }
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    },

    findObjectsByType: function(type, map, layer) {
        var result = [];
        map.objects[layer].forEach(function(element){
            if(element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust the y position
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact pixel position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    }

};