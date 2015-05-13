// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.

// global variables
var dictSize = dict.length;
console.log("Dictionary length: " + dictSize);
var generator;
var speed = -80;		// -ve: move to left
var minSpeed = -0;
var interval = 2000;
var total = 0;
var enemies = [];
var inText = "";

// values for collision detection
// when (A's collisionMask = B's type) ==> collision!!
var SPRITE_NONE = 0;
var SPRITE_RACER = 1;
var SPRITE_OTHER = 2;


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
			asset: 'base.png',
			type: SPRITE_OTHER
		});
	}
	
});

// Enemy Sprite
Q.Sprite.extend("Enemy",{
  init: function(p) {
	this._super(p, { 
		asset: "lufsig.png",
		vx: minSpeed + speed, 	//  * Math.random()
		text: 'default text',
		type: SPRITE_RACER,
		collisionMask: SPRITE_OTHER
	});

	this.add('2d');

	// Listen for a sprite collision
	this.on("bump.left,bump.right,bump.bottom",function(collision) {
		if(collision.obj.isA("Base")) { 
			// minus the HP
			Q.state.dec("HP", 10);
			this.destroy();
			
			// check if HP equals zero, end the game
			if (Q.state.get("HP") == 0){
				clearInterval(generator);
				Q.state.reset({HP: 0});
				Q.stageScene("endGame",1, { label: "Game Over!" });
			}
	  }
	});

  }
});


// HP sprite
Q.UI.Text.extend("HP",{ 
	init: function(p) {
		this._super({
			label: "HP: 100",
			x: 80,
			y: 0
		});

		Q.state.on("change.HP",this,"HP");
	},

	HP: function(HP) {
		this.p.label = "HP: " + HP;
	}
});

// number of kills display
Q.UI.Text.extend("Kill",{ 
	init: function(p) {
		this._super({
			label: "Kills: 0",
			x: 250,
			y: 0
		});

		Q.state.on("change.kill",this,"kill");
	},

	kill: function(kill) {
		this.p.label = "Kills: " + kill;
	}
});

// input key display
Q.UI.Text.extend("Input",{ 
	init: function(p) {
		this._super({
			label: "Input: ",
			x: 500,
			y: 300
		});

	},

	input: function(label) {
		this.p.label = "Input: " + label;
	}
});


// ## Level1 scene
Q.scene("level1",function(stage) {
	
	// initialization: reset the game states, inText, enemies, total number of enemies
	Q.state.reset({HP: 100, kill: 0});
	inText = "";
	enemies = [];
	total = 0;
	
	// Add in a repeater for a little parallax action
	stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

	// Add in a tile layer, and make it the collision layer
	stage.collisionLayer(new Q.TileLayer({
							dataAsset: 'level.json',
							sheet: 'tiles',
							type: SPRITE_OTHER							
						}));
	
	// add HP and kill display
	stage.insert(new Q.HP());
	stage.insert(new Q.Kill());
	
	// add input display
	var inputDisplay = stage.insert(new Q.Input());
	
	// add Base 
	stage.insert(new Q.Base({ x: 180, y: 160 }));
  
	// generate Enemy every 2 sec interval
	generator = setInterval(function(){
		// randomly generate a word from dict
		var ran = Math.floor(Math.random()*(dictSize));
		var targetText = dict[ran];
		// console.log("Word generated: " + targetText);
		
		// labelled enemy
		enemies[total] = stage.insert(new Q.Enemy({
			x: 1200, 
			y: 0, 
			label_text: targetText,
			label_text_color: 'grey',
			label_offset_x: 0,
			label_offset_y: -50
		}));
		
		var container = stage.insert(new Q.UI.Container({
		x: enemies[total].p.label_offset_x,
		y: enemies[total].p.label_offset_y, 
		fill: "rgba(256,0,0,0.5)"
		}), enemies[total]);
		
		var label = container.insert(new Q.UI.Text({
		label: targetText,
		color: enemies[total].p.label_text_color
		}));
		
		/*
		var label = stage.insert(new Q.UI.Text({
			label: label_sprite.p.label_text,
			color: label_sprite.p.label_text_color,
			x: label_sprite.p.label_offset_x,
			y: label_sprite.p.label_offset_y
		}), label_sprite);
		*/
		
		total++;
		
	}, interval);

		
	
	// detect key pressed, event "keydown"
	Q.input.on("keydown", stage, function(e){
		try{
			if (e >= 65 && e <=90){
				// A-Z: add the char to inText
				var key = String.fromCharCode(e);
				// console.log("Key: " + key);
				inText += key;
				
			} else if (e == 32){
				// space: fire the string
				console.log("Fire! String: " + inText);
				for (i = 0; i < total; i++){
					if (inText == enemies[i].p.label_text.toUpperCase()){
						enemies[i].destroy();
						Q.state.inc("kill", 1);
					}
				}
				
				inText = "";
				
			} else if (e == 8){
				// backspace: remove last typed char
				console.log("Backspace!");
				inText = inText.slice(0,-1);
			} else {
				// others: do nothing
			}
			
			inputDisplay.input(inText);
			
		} catch (err){
			console.log(err);
		}
	});
	
	
});

// start scene
Q.scene('start',function(stage) {
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
	
	// When the button is clicked, clear all the stages and restart the game.
	button.on("click",function() {
		Q.clearStages();
		Q.stageScene('level1');
	});

	// Expand the container to visibily fit it's contents (with a padding of 20 pixels)
	container.fit(20);
});

// endGame scene: to display a game over popup box
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
	
	// When the button is clicked, clear all the stages and restart the game.
	button.on("click",function() {
		Q.clearStages();
		Q.stageScene('level1');
	});

	// Expand the container to visibily fit it's contents (with a padding of 20 pixels)
	container.fit(20);
});

// ## Asset Loading and Game Launch
Q.load("base.png, lufsig.png, sprites.png, sprites.json, level.json, tiles.png, background-wall.png", function() {
	// Sprites sheets can be created manually
	Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

	// Or from a .json asset that defines sprite locations
	Q.compileSheets("sprites.png","sprites.json");

	// call stageScene to run the game
	Q.stageScene("level1");
  
	// Turn visual debugging
	// Q.debug = true;
	
	// Turn on default keyboard controls
	Q.input.keyboardControls(Quintus.Input.KEY_NAMES);
});

});
