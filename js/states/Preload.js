// Preload.js

var Climb = Climb || {},
	hasTouch;

var h1_style, h2_style, h3_style, p_style, buttonStyle;

// constant colours
var noColour = 0xffffff;
var isDownColour = 0xf6d809;
var defaultColour = noColour; // 0xfc6744;
var groundColour = 0x646A11;

var bestTime = null;

//loading the game assets
Climb.Preload = function() {};

Climb.Preload.prototype = {
	init: function() {
		this.game.world.resize(settings.WIDTH, settings.HEIGHT);
	},
	preload: function() {

		createBG(0x000000);

		hasTouch = this.game.device.touch;

		// show logo in loading screen
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);
		this.splash.scale.set(0.5);

		// add preloader
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
		this.preloadBar.anchor.setTo(0.5);

		this.load.setPreloadSprite(this.preloadBar);

		// Images
		// fpo
		this.load.image('fpo-square', 'assets/img/fpo-square.gif');
		this.load.image('fpo-circle', 'assets/img/fpo-circle.png');
		this.load.image('square', 'assets/img/white-square.gif');
		this.load.image('circle', 'assets/img/white-circle.png');

		// wordmark
		this.load.image('wordmark', 'assets/img/wordmark.png');

		// instructions
		var keysURL = 'assets/img/keys.png',
			instr1URL = 'assets/img/instructions1.png',
			instr2URL = 'assets/img/instructions2.png';
		if(hasTouch){
			keysURL = 'assets/img/buttons.png';
			instr1URL = 'assets/img/instructions1-touch.png',
			instr2URL = 'assets/img/instructions2-touch.png';
		}
		this.load.image('inst-keys', keysURL); // inputs
		this.load.spritesheet('instructions1', instr1URL, 201, 181, 11); // boosting	
		this.load.spritesheet('instructions2', instr2URL, 201, 181, 11); // rope climb
		this.load.image('inst-peak', 'assets/img/instructions-peak.png'); // win

		// icons 
		this.load.image('icon-walk-right', 'assets/img/i/walk-right.png');
		this.load.image('icon-menu', 'assets/img/i/menu.png');
		this.load.image('icon-overflow', 'assets/img/i/overflow.png');
		this.load.image('icon-x', 'assets/img/i/x.png');
		this.load.image('icon-refresh', 'assets/img/i/refresh.png');
		this.load.image('icon-phone', 'assets/img/i/phone.png');
		this.load.image('icon-chat', 'assets/img/i/chat.png');
		this.load.image('icon-note', 'assets/img/i/note.png');
		this.load.image('icon-speaker', 'assets/img/i/speaker.png');
		this.load.image('icon-expand', 'assets/img/i/expand.png');
		this.load.image('icon-contract', 'assets/img/i/contract.png');
		this.load.image('icon-screenshot', 'assets/img/i/screenshot.png');
		this.load.image('icon-arrow-left', 'assets/img/i/arrow-left.png');

		// sprites
		this.load.image('bg-mountains', 'assets/img/bg-mountains.png');
		this.load.image('fg-mountains', 'assets/img/fg-mountain.png');

		// spritesheets
		// this.load.spritesheet('icon-sound', 'assets/img/i/soundOnOff.png', 60, 60);
		this.load.spritesheet('icon-fullscreen', 'assets/img/i/expand-contract.png', 60, 60);
		
		this.load.spritesheet('goat', 'assets/img/goat2.png', 47, 56, 13); // goat

		this.load.spritesheet('av-t', 'assets/img/av-t.png', 69, 100, 13); // 101	
		this.load.spritesheet('av-e', 'assets/img/av-e.png', 72, 100, 13); // 102
		this.load.spritesheet('av-a', 'assets/img/av-a.png', 74, 100, 13); // 101
		this.load.spritesheet('av-m', 'assets/img/av-m.png', 73, 100, 13); // 102			

		// Audio        
		//this.load.audio('hit1', 'assets/audio/bat_hit_ball.mp3');		

		// Webfonts
		// The Google WebFont Loader will look for this object, so create it before loading the script.
		WebFontConfig = {
			//  'active' means all requested fonts have finished loading
			//  We set a 1 second delay before calling 'createText'.
			//  For some reason if we don't the browser cannot render the text the first time it's created.
			active: function() {
				Climb.game.time.events.add(Phaser.Timer.SECOND, createText, this);
			},
			//  The Google Fonts we want to load (specify as many as you like in the array)
			google: {
				families: ['Open+Sans:300,400,700:latin']
			}
		};
		this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');		

		createStyles(); // set Title, body styles for project
	},
	create: function() {
		this.state.start('MainMenu');
	}
};

function createText() {

	// do nothing
}

function createStyles() {

	var black = "#000";
	var white = "#fff";

	h1_style = {
		font: "700 50px Open Sans",
		fill: white,
		align: "center"
	};
	h2_style = {
		font: "300 40px Open Sans",
		fill: white,
		align: "center"
	};
	h3_style = {
		font: "300 25px Open Sans",
		fill: white,
		align: "center"
	};
	h3_style_blue = {
		font: "300 25px Open Sans",
		fill: "#4ac7eb",
		align: "center"
	};
	p_style = {
		font: "300 18px Open Sans",
		fill: white
	};
	p_style_center = {
		font: "300 18px Open Sans",
		fill: white,
		align: "center"
	};
	copyright_style = {
		font: "300 10px Open Sans",
		fill: "#938884",
		align: "right"
	};
	copyright_style_dark = {
		font: "300 10px Open Sans",
		fill: "#000000",
		align: "right"
	};
	button_style = {
		font: "400 16px Open Sans",
		fill: white,
		align: "center"
	};
	touch_button_style = {
		font: "700 30px Open Sans",
		fill: white,
		align: "center"
	};
}