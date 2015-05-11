// main.js
// the main javascript file for the game - Typing of the Dead

// array of words in dictionary
var dict = [];



window.addEventListener("load",function() {

// Set up an instance of the Quintus engine
var Q = window.Q = Quintus()
		.include(("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

		
// Define the sprites
// the init constructor is called on creation

// base sprite
Q.Sprite.extend("Base", {
	init: function(p) {
		this._super(p, { sheet: 'base' });
	}
	
});

// monster sprite
Q.Sprite.extend("monster", {
	init: function(p) {
		this._super(p, { sheet: 'monster', vx: 100, text: 'default text' });
		
		// use the Bounce AI to change direction 
		// whenver they run into something.
		this.add('2d, aiBounce');
		
		// Listen for a sprite collision
		this.on("bump.left,bump.right,bump.bottom",function(collision) {
		  if(collision.obj.isA("Base")) { 
			// minus the score
			/*
			To be implement
			
			*/
			
			
			this.destroy();
		  }
		});
	}
});	

// start scene



// level1 scene
// main game scene
Q.scene("level1",function(stage) {

	// Add in a repeater for a little parallax action
	stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

	// Add in a tile layer, and make it the collision layer
	stage.collisionLayer(new Q.TileLayer({
							dataAsset: 'level.json',
							sheet: 'tiles' 
						}));

						
	// randomly generate a word from dict
	var dictSize = 73023;
	var ran = Math.floor(Math.random()*(dictSize));
	var targetText = dict[ran];
	
	// labelled enemy
	var label_sprite = stage.insert(new Q.Enemy({
		x: 700, 
		y: 0, 
		label_text: "Enemy",
		label_text_color: 'grey',
		label_offset_x: 0,
		label_offset_y: -50
	}));
	
	var label = stage.insert(new Q.UI.Text({
		label: label_sprite.p.label_text,
		color: label_sprite.p.label_text_color,
		x: label_sprite.p.label_offset_x,
		y: label_sprite.p.label_offset_y
	}), label_sprite);
	
	// Finally add in the tower goal
	stage.insert(new Q.Base({ x: 180, y: 50 }));
});


// endGame scene
// to display a game over popup box and final score
Q.scene('endGame',function(stage) {
	  var container = stage.insert(new Q.UI.Container({
		x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	  }));

	  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
													  label: "Play Again" }))         
	  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
													   label: stage.options.label }));
	  // When the button is clicked, clear all the stages
	  // and restart the game.
	  button.on("click",function() {
		Q.clearStages();
		Q.stageScene('level1');
	  });

	  // Expand the container to visibily fit it's contents
	  // (with a padding of 20 pixels)
	  container.fit(20);
});


});