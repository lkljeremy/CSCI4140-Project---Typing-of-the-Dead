// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.

// print length of array in dictionary.js
var dictSize = dict.length;
console.log("Dictionary length: " + dictSize);
var generator;


window.addEventListener("load",function() {

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.
var Q = window.Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
		// Maximize this game to whatever the size of the browser is
		.setup({ maximize: true })
		// And turn on default input controls and touch input (for UI)
		.controls().touch()

		
		
// Define the sprites
// the init constructor is called on creation

// Base sprite
Q.Sprite.extend("Base", {
	init: function(p) {
		this._super(p, { 
			asset: 'base.png' 
		});
	}
	
});
		

// Enemy Sprite
Q.Sprite.extend("Enemy",{
  init: function(p) {
	this._super(p, { 
		// sheet: 'enemy',
		asset: "lufsig.png",
		vx: 100, 
		text: 'default text' 
	});

	// Enemies use the Bounce AI to change direction 
	// whenver they run into something.
	this.add('2d, aiBounce');

	// Listen for a sprite collision
	this.on("bump.left,bump.right,bump.bottom",function(collision) {
		if(collision.obj.isA("Base")) { 
			// minus the score
			Q.state.dec("score", 10);
			this.destroy();
			
			// check if score equals zero, end the game
			if (Q.state.get("score") == 0){
				clearInterval(generator);
				Q.state.reset({score: 0});
				Q.stageScene("endGame",1, { label: "Game Over!" });
			}
	  }
	});

  }
});


// score sprite
Q.UI.Text.extend("Score",{ 
	init: function(p) {
		this._super({
			label: "score: 100",
			x: 80,
			y: 0
		});

		Q.state.on("change.score",this,"score");
	},

	score: function(score) {
		this.p.label = "score: " + score;
	}
});

// input key display
Q.UI.Text.extend("Input",{ 
	init: function(p) {
		this._super({
			label: "Input: ",
			x: 200,
			y: 200
		});

		Q.state.on("change.score",this,"score");
	},

	score: function(score) {
		this.p.label = "score: " + score;
	}
});



// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {
	
	// reset the score
	Q.state.reset({score: 100});
	
	// Add in a repeater for a little parallax action
	stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

	// Add in a tile layer, and make it the collision layer
	stage.collisionLayer(new Q.TileLayer({
							dataAsset: 'level.json',
							sheet: 'tiles' 
						}));
	
	// add score display
	stage.insert(new Q.Score());
	
	// add Base 
	stage.insert(new Q.Base({ x: 180, y: 160 }));
  
	// generate Enemy every 2 sec
	generator = setInterval(function(){
		// randomly generate a word from dict
		var ran = Math.floor(Math.random()*(dictSize));
		var targetText = dict[ran];
		// console.log("Word generated: " + targetText);
		
		// labelled enemy
		var label_sprite = stage.insert(new Q.Enemy({
			x: 700, 
			y: 0, 
			label_text: targetText,
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
	
	}, 2000);
	
	function myStopFunction() {
		clearInterval(generator);
	}
});

// endGame scene
// to display a game over popup box
Q.scene('endGame',function(stage) {
	var container = stage.insert(new Q.UI.Container({
		x: Q.width/2, 
		y: Q.height/2, 
		fill: "rgba(0,0,0,0.5)"
	}));

	var button = container.insert(new Q.UI.Button({ 
		x: 0, 
		y: 0, 
		fill: "#CCCCCC",
		label: "Play Again" 
	}));
	
	var label = container.insert(new Q.UI.Text({
		x:10, 
		y: -10 - button.p.h, 
		label: stage.options.label 
	}));
	
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

// ## Asset Loading and Game Launch
// Q.load can be called at any time to load additional assets
// assets that are already loaded will be skipped
// The callback will be triggered when everything is loaded
Q.load("base.png, lufsig.png, sprites.png, sprites.json, level.json, tiles.png, background-wall.png", function() {
  // Sprites sheets can be created manually
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  // Or from a .json asset that defines sprite locations
  Q.compileSheets("sprites.png","sprites.json");

  // Finally, call stageScene to run the game
  Q.stageScene("level1");
});

// ## Possible Experimentations:
// 
// The are lots of things to try out here.
// 
// 1. Modify level.json to change the level around and add in some more enemies.
// 2. Add in a second level by creating a level2.json and a level2 scene that gets
//    loaded after level 1 is complete.
// 3. Add in a title screen
// 4. Add in a hud and points for jumping on enemies.
// 5. Add in a `Repeater` behind the TileLayer to create a paralax scrolling effect.

});
