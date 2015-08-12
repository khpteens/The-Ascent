// main.js

var Climb = Climb || {};

// create game object
Climb.game = new Phaser.Game(settings.WIDTH, settings.HEIGHT, Phaser.CANVAS, settings.CONTAINER);

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