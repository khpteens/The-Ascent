// main.js

// main.js

var deviceW = window.innerWidth,
	deviceH = window.innerHeight,
	deviceRatio = deviceH / deviceW;

if(deviceRatio <= 1.2) deviceRatio = 1.2;

var GAME_WIDTH = 500,
	GAME_HEIGHT = deviceRatio * GAME_WIDTH;

var Climb = Climb || {};

// create game object
Climb.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, ''); // , null, false, false); // to not anti-alias

// create game states
Climb.game.state.add('Boot', Climb.Boot);
Climb.game.state.add('Preload', Climb.Preload);
Climb.game.state.add('MainMenu', Climb.MainMenu);
Climb.game.state.add('Instructions', Climb.Instructions);
Climb.game.state.add('Game', Climb.Game);
Climb.game.state.add('Finish', Climb.Finish);
Climb.game.state.add('Contact', Climb.Contact);

// run
Climb.game.state.start('Boot');