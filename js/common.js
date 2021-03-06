// Common.js holds utility functions & settings

// VARIABLES ***********************************************

var settings = {

	"NAME": "The Ascent",
	"RELEASE": "Release Candidate",
	"UPDATED": "Sept.21.2015",

	"WIDTH": 500,
	"HEIGHT": 600,
	"RATIO": window.outerHeight / window.outerWidth,
	"RATIO_MIN": 1.1,
	"RATIO_MAX": 1.4,

	"PAUSED": false,

	"GA_CODE": "UA-66839321-1",
	"ANALYTICS_ON": true,

	"SOUND_ON": true,
	"VOLUME": 1,

	"FULLSCREEN": false,

	"CONTAINER": "game",
	"FRAME": document.getElementById("game"),
	"ELEMENT": document.querySelector('#game'),
	"FRAME_WIDTH": Number(window.getComputedStyle(document.querySelector('#game')).width.replace(/\D/g, '')),
	"FRAME_HEIGHT": Number(window.getComputedStyle(document.querySelector('#game')).height.replace(/\D/g, ''))
};

if (settings.RATIO <= settings.RATIO_MIN) {
	settings.RATIO = settings.RATIO_MIN; // shortest is 500px by 550px
}else if(settings.RATIO > settings.RATIO_MAX){
	settings.RATIO = settings.RATIO_MAX; // tallest is 500px by 800px, 
}

settings.HEIGHT = settings.RATIO * settings.WIDTH;

var copyright_txt = "© BroTalk",	
	soundBt, fullscreenBt;

trace(settings.NAME + " | " + settings.RELEASE + " | " + settings.UPDATED);

fullscreenToggle();

// FUNCTIONS ***********************************************

function trace(s, c, bg) {
	var style;
	if (bg === undefined) bg = 'WhiteSmoke';
	if (c !== undefined) {
		style = 'background: ' + bg + '; color: ' + c + '; border-left: 7px solid ' + c + ';';
	} else {
		c = '#333';
		style = 'background: ' + bg + '; color: ' + c + ';';
	}
	console.log('%c ' + s + ' ', style);
}

function createBG(color, bg) {
	bg_group = Climb.game.add.group();

	if (!bg) {
		var bg = Climb.game.add.graphics(0, 0);
	}
	bg.inputEnabled = true;
	bg.beginFill(color, 1);
	bg.boundsPadding = 0;
	bg.drawRect(0, 0, Climb.game.width, Climb.game.height);
	bg_group.add(bg);

	var st = Climb.game.state.getCurrentState().key;
	if (st != "Preload" && st != "Game") {
		var bg_image = Climb.game.add.sprite(Climb.game.width / 2, Climb.game.height / 2, "bg-mountains");
		// bg_image.width = Climb.game.width;
		bg_image.height = Climb.game.height;
		bg_image.anchor.set(0.5);
		bg_image.scale.set(1.2);
		// bg_image.tint = color;
		bg_image.alpha = 0.3;
	}
}

function createBt(button, label_text, target_state, shape, iconImage) {

	if (!label_text) label_text = "";
	if (!shape) shape = "default";

	// sprite parameters	
	if (shape == "circle") {
		button.height = button.h = 60;
		button.width = button.w = 60;
	} else if (shape == "square-small") {
		button.height = button.h = 30;
		button.width = button.w = 30;
	} else {
		button.height = button.h = 60;
		button.width = button.w = 350;
	}

	button.anchor.set(0.5);
	button.inputEnabled = true;
	button.input.useHandCursor = true;
	button.tint = 0xffffff;
	button.bringToTop();
	button.alpha = 0;

	// add border
	var border = Climb.game.add.graphics(0, 0);
	border.lineStyle(2, 0xffffff, 1);
	if (shape == "circle") {
		// border.drawCircle(button.x, button.y, button.width, button.height);
		border.drawRect(button.x - button.width / 2, button.y - button.height / 2, button.width, button.height);
	} else {
		border.drawRect(button.x - button.width / 2, button.y - button.height / 2, button.width, button.height);
	}
	border.boundsPadding = 0;
	button.border = border;
	border.alpha = 1;
	if (shape == "square-small") border.alpha = 0;

	// add label
	var label;
	if (label_text.indexOf("icon") == -1) {
		label = Climb.game.add.text(button.x, button.y + 3, label_text.toUpperCase(), button_style);
		label.lineSpacing = -5;
	} else {
		label = Climb.game.add.sprite(button.x, button.y, label_text);

		var labelSize = 25;
		if (shape == "square-small") {
			labelSize = 18;
		}
		label.width = labelSize;
		label.height = labelSize;
	}
	label.anchor.set(0.5);
	button.label = label; //  save reference to letter

	var icon;
	var iconMod = 30;
	if (iconImage) {
		icon = Climb.game.add.sprite(button.x - button.width / 2 + iconMod, button.y, iconImage);
		icon.anchor.set(0.5);
		icon.height = button.height - iconMod;
		icon.width = button.height - iconMod;
		button.icon = icon;
	}

	if (target_state != false && target_state != undefined) {
		button.events.onInputUp.add(function() {			
			if(!hasTouch){
				Climb.game.stateTransition.to(target_state);
			}else{
				Climb.game.state.start(target_state);
			}
		}, this);
	}
	button.events.onInputOver.add(function() {
		// button.tint = isDownColour;		
		Climb.game.add.tween(button).to({
			// width: button.w + 10,
			// height: button.h + 10,
			alpha: 1
		}, 200, Phaser.Easing.Quadratic.Out, true);
		//button.alpha = 1;
		button.label.tint = 0x000000;
		// if(button.icon) button.icon.tint = 0x000000;

	}, this);
	button.events.onInputOut.add(function() {
		// button.tint = noColour;
		Climb.game.add.tween(button).to({
			// width: button.w,
			// height: button.h,
			alpha: 0
		}, 200, Phaser.Easing.Quadratic.In, true);
		// button.alpha = 0;
		button.label.tint = 0xffffff;
		// if(button.icon) button.icon.tint = 0xffffff;
	}, this);
	button.events.onInputDown.add(function() {
		button.tint = 0x4ac7eb;
	});
	button.events.onInputUp.add(function() {
		button.tint = 0xffffff;
		// button.alpha = 0;
		// button.label.tint = 0xffffff;
	});

	// to address all button elements use group 
	btGroup = Climb.game.add.group();

	btGroup.add(button);
	btGroup.add(border);
	btGroup.add(label);
	// if (iconImage) btGroup.add(icon);

	button.group = btGroup; // save a reference for later usage
}

function createCopyright() {

	var st = Climb.game.state.getCurrentState().key,
		style = copyright_style,
		copyright_shift = 10;
	if (st === "Game") {
		style = copyright_style_dark;		
	}

	// add copyright text	
	var c = Climb.game.add.text(copyright_shift, Climb.game.height - 3, copyright_txt, style);
	c.anchor.set(0, 1);
	c.fixedToCamera = true;

	// release	
	// var release = Climb.game.add.text(10, Climb.game.height - 3, release_txt, style);
	// release.anchor.set(0, 1);
	// release.fixedToCamera = true;	

	createSoundScreenToggles();
}

function createSoundScreenToggles() {

	// // soundBt
	// var soundBt = Climb.game.add.sprite(Climb.game.width - 15, Climb.game.height - 45, "square");
	// createBt(soundBt, "icon-screenshot", false, "square-small");
	// soundBt.group.fixedToCamera = true;
	// soundBt.events.onInputUp.add(function() {	// 		
	// 	createScreenshot();	// 	
	// });

	// fullscreenBt
	fullscreenBt = Climb.game.add.sprite(Climb.game.width - 15, Climb.game.height - 15, "square");
	createBt(fullscreenBt, "icon-fullscreen", false, "square-small");
	fullscreenBt.group.fixedToCamera = true;
	if(settings.FULLSCREEN) fullscreenBt.label.frame = 1;
	fullscreenBt.events.onInputUp.add(function() {
		fullscreenToggle();
	});	
}

function openInNewTab(url) {
	var win = window.top.open(url, '_blank');
	win.focus();
}

function soundToggle() {

	if (!settings.SOUND_ON) {
		settings.SOUND_ON = true;
		settings.VOLUME = 0.2;
		soundBt.label.frame = 0;
	} else {
		settings.SOUND_ON = false,
		settings.VOLUME = 0;
		soundBt.label.frame = 1;
	}
}

function fullscreenToggle() {

	if (!settings.FULLSCREEN) {

		settings.FULLSCREEN = true;
		settings.FRAME_WIDTH = settings.FRAME.style.width;
		settings.FRAME_HEIGHT = settings.FRAME.style.height;

		settings.FRAME.style.zindex = 500;
		settings.FRAME.style.position = "absolute";
		settings.FRAME.style.width = window.innerWidth + "px";
		settings.FRAME.style.height = window.innerHeight + "px";

		if(fullscreenBt) fullscreenBt.label.frame = 1;

	} else {
		settings.FULLSCREEN = false;

		settings.FRAME.style.zindex = 1;
		settings.FRAME.style.position = "relative";
		settings.FRAME.style.width = settings.FRAME_WIDTH;
		settings.FRAME.style.height = settings.FRAME_HEIGHT;

		fullscreenBt.label.frame = 0;
	}
}

function createScreenshot() {

	var url = document.getElementById("game").childNodes[0].toDataURL('png');
	openInNewTab(url);    
}