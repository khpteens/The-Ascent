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
		var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 220, text, h1_style);
		t.anchor.set(0.5);

		createInstructions();

		// create buttons
		// Continue
		var continueBt = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 170, "square");
		createBt(continueBt, "Play game", "Game");	  

		// Back button
		var backBt = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 230, "square");
		createBt(backBt, "Main menu", "MainMenu");
	},
	update: function() {}
};

function createInstructions() {

	// create and add text sprite telling the player they have won    

	var text = "1. Tap the T, E, A & M keys on your keyboard.\n\n";
	if (hasTouch) text = "1. Tap the T, E, A & M buttons on the screen.\n\n";
	text += "2. Tap & hold letters to help your climbers\nreach the peak.\n\n";
	text += "3. Your climbers can lift and pull\neach other up.\n\n";
	text += "4. Reach the summit to win.";

	var instructions = Climb.game.add.text(50, Climb.game.height / 2 - 160, text, p_style);
}