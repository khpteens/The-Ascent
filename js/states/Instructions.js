// Finish.js
var myCounter = 0,
	boost_instr,
	rope_instr,
	panes = [],
	cPane = 0,
	inst_continueBt, inst_prevBt;


var Climb = Climb || {};

//loading the game assets
Climb.Instructions = function() {

	this.myCounter = 0;
};

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

		// createInstructions();

		createPane1();
		createPane2();
		createPane3();
		createPane4();
		panes[0].visible = true;

		// create buttons
		// Continue
		inst_continueBt = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 160, "square");
		createBt(inst_continueBt, "Play game", "Game");
		inst_continueBt.group.visible = false;
		inst_continueBt.events.onInputUp.add(function() {
			panes = [];
			cPane = 0;
		}, this);

		// Back button
		var backBt = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 220, "square");
		createBt(backBt, "Main menu", "MainMenu");
		backBt.events.onInputUp.add(function() {
			panes = [];
			cPane = 0;
		}, this);

		// next button
		inst_nextBt = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 160, "square");
		createBt(inst_nextBt, "Next", false);
		inst_nextBt.events.onInputUp.add(clickNextBt, this);

		// // next2 button (next arrow)
		// inst_nextBt2 = Climb.game.add.sprite(Climb.game.width / 2 + 205, Climb.game.height / 2 + 160, "square");
		// createBt(inst_nextBt2, "icon-arrow-left", false, "circle");
		// inst_nextBt2.label.width *= -1;
		// inst_nextBt2.events.onInputUp.add(clickNextBt, this);
		// inst_nextBt2.group.visible = false;

		// prev button (back arrow)
		inst_prevBt = Climb.game.add.sprite(Climb.game.width / 2 - 205, Climb.game.height / 2 + 160, "square");
		createBt(inst_prevBt, "icon-arrow-left", false, "circle");
		inst_prevBt.events.onInputUp.add(clickPrevBt, this);
		inst_prevBt.group.visible = false;

	},
	update: function() {

		myCounter++;
		if (myCounter > 30) {
			boost_instr.frame = boost_instr.frame + 1;
			if (boost_instr.frame >= 11) {
				boost_instr.frame = 1;
			}
			rope_instr.frame = boost_instr.frame;
			myCounter = 0;
		}
	}
};

function createPane1() {

	var pane = Climb.game.add.group();

	// image
	var img = "inst-keys";
	if (hasTouch) img = "inst-buttons";
	var keys = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 - 0, img);
	keys.anchor.set(0.5);
	keys.scale.set(1.5);
	pane.add(keys);

	// text
	var text = "1. Tap the T, E, A & M\nkeys on your keyboard.";
	if (hasTouch) text = "1. Tap the T, E, A & M\nbuttons on the screen.";
	var t = Climb.game.add.text(Climb.game.width / 2, Climb.game.height / 2 - 95, text, h3_style);
	t.anchor.set(0.5, 1);
	pane.add(t);

	panes.push(pane);
	pane.visible = false;
}

function createPane2() {

	var pane = Climb.game.add.group();

	// image
	boost_instr = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 15, "instructions1");
	boost_instr.frame = 1;
	boost_instr.anchor.set(0.5);
	pane.add(boost_instr);

	var border = Climb.game.add.graphics(0, 0);
	border.lineStyle(3, 0x000000, 1);
	border.drawRect(0, 0, boost_instr.width, boost_instr.height);
	border.x = Climb.game.width / 2 - boost_instr.width / 2;
	border.y = Climb.game.height / 2 - boost_instr.height / 2 + 15;
	border.boundsPadding = 0;
	pane.add(border);

	// text
	var text = "2. Tap & hold letters to help\nyour climbers reach the peak.";
	var t = Climb.game.add.text(Climb.game.width / 2, Climb.game.height / 2 - 95, text, h3_style);
	t.anchor.set(0.5, 1);
	pane.add(t);

	panes.push(pane);
	pane.visible = false;
}

function createPane3() {

	var pane = Climb.game.add.group();

	// image
	rope_instr = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 15, "instructions2");
	rope_instr.anchor.set(0.5);
	pane.add(rope_instr);

	var border = Climb.game.add.graphics(0, 0);
	border.lineStyle(3, 0x000000, 1);
	border.drawRect(0, 0, boost_instr.width, boost_instr.height);
	border.x = Climb.game.width / 2 - boost_instr.width / 2;
	border.y = Climb.game.height / 2 - boost_instr.height / 2 + 15;
	border.boundsPadding = 0;
	pane.add(border);

	// text
	var text = "3. Your climbers can lift\nand pull each other up.";
	var t = Climb.game.add.text(Climb.game.width / 2, Climb.game.height / 2 - 95, text, h3_style);
	t.anchor.set(0.5, 1);
	pane.add(t);

	panes.push(pane);
	pane.visible = false;
}

function createPane4() {

	var pane = Climb.game.add.group();

	// image
	var peak = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2 + 15, "inst-peak");
	peak.anchor.set(0.5);
	pane.add(peak);

	var border = Climb.game.add.graphics(0, 0);
	border.lineStyle(3, 0x000000, 1);
	border.drawRect(0, 0, peak.width, peak.height);
	border.x = Climb.game.width / 2 - peak.width / 2;
	border.y = Climb.game.height / 2 - peak.height / 2 + 15;
	border.boundsPadding = 0;
	pane.add(border);

	// text
	var text = "4. Reach the\nsummit to win.";
	var t = Climb.game.add.text(Climb.game.width / 2, Climb.game.height / 2 - 95, text, h3_style);
	t.anchor.set(0.5, 1);
	pane.add(t);

	panes.push(pane);
	pane.visible = false;
}

function updatePane(n) {

	if (!inst_prevBt.group.visible) inst_prevBt.group.visible = true;

	rope_instr.frame = boost_instr.frame = 0;

	panes[cPane].visible = false; // hide old pane	

	cPane += n;

	inst_continueBt.group.visible = false; // show "Play Game" button		
	inst_nextBt.group.visible = true; // hide "Continue" button

	if (cPane >= panes.length) {
		cPane = 0;
	} else if (cPane < 0) {
		cPane = panes.length - 1;
	} else if (cPane == panes.length - 1) {
		inst_continueBt.group.visible = true; // show "Play Game" button		
		inst_nextBt.group.visible = false; // hide "Continue" button
	}

	panes[cPane].visible = true; // show new pane
}

function clickNextBt() {
	updatePane(1);
}

function clickPrevBt() {
	updatePane(-1);
}