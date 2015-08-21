// Finish.js

var Climb = Climb || {};

//loading the game assets
Climb.Instructions = function() {};

Climb.Instructions.prototype = {
	init: function() {
		this.game.world.resize(settings.WIDTH, settings.HEIGHT);
	},
	create: function() {

		createBG(0x222222);
		createCopyright();

		// start game text
		var text = "How to play";
		var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 230, text, h1_style);
		t.anchor.set(0.5);

		createInstructions();

		// create buttons
		// Continue
		var continueBt = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 160, "square");
		createBt(continueBt, "Play game", "Game");	  

		// Back button
		var backBt = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 220, "square");
		createBt(backBt, "Main menu", "MainMenu");
	},
	update: function() {}
};

function createInstructions() {

	// create and add text sprite telling the player they have won    

	var text = "1. Tap the T, E, A & M\nkeys on your keyboard.\n\n";
	if (hasTouch) text = "1. Tap the T, E, A & M\nbuttons on the screen.\n\n";
	text += "2. Tap & hold letters to help\nyour climbers reach the peak.\n\n";
	text += "3. Your climbers can lift\nand pull each other up.\n\n";
	text += "4. Reach the summit to win.";

	var instructions = Climb.game.add.text(Climb.game.width / 2 - 35, Climb.game.height / 2 - 175, text, p_style);

	var rope_img = Climb.game.add.sprite(Climb.game.width / 2 - 175, Climb.game.height / 2 - 175, "inst-rope");
	rope_img.scale.set(0.7);

	var stack_img = Climb.game.add.sprite(Climb.game.width / 2 - 175, Climb.game.height / 2 - 25, "inst-stack");
	stack_img.scale.set(0.7);  
}