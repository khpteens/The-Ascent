// Utility.js holds utility functions

var analyticsOn = false; // turn on Google Analytics event tracking 
var copyright_txt = "© Brotalk",
	release_txt = "BETA"; // .July.30.2015";


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
	if(st != "Preload" && st != "Game"){
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

	// add label
	var label;
	if (label_text.indexOf("icon") == -1){
		label = Climb.game.add.text(button.x, button.y + 3, label_text.toUpperCase(), button_style);
		label.lineSpacing = -5;
	}else{
		label = Climb.game.add.sprite(button.x, button.y, label_text);
		label.width = 25;
		label.height = 25;
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
			Climb.game.stateTransition.to(target_state);
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
}

function createCopyright() {

	var st = Climb.game.state.getCurrentState().key,
		style = copyright_style;
	if(st === "Game"){		
		style = copyright_style_dark;
	}

	// add copyright text	
	var c = Climb.game.add.text(Climb.game.width - 10, Climb.game.height, copyright_txt, style);
	c.anchor.set(1, 1);
	c.fixedToCamera = true;

	// release	
	var release = Climb.game.add.text(10, Climb.game.height, release_txt, style);
	release.anchor.set(0,1);
	release.fixedToCamera = true;
}

function openInNewTab(url) {
	var win = window.top.open(url, '_blank');
	win.focus();
}

// Google Analytics & Events
// (function(i, s, o, g, r, a, m) {
//   i['GoogleAnalyticsObject'] = r;
//   i[r] = i[r] || function() {
//     (i[r].q = i[r].q || []).push(arguments)
//   }, i[r].l = 1 * new Date();
//   a = s.createElement(o),
//     m = s.getElementsByTagName(o)[0];
//   a.async = 1;
//   a.src = g;
//   m.parentNode.insertBefore(a, m)
// })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
// ga('create', 'UA-15452863-1', 'auto');
// ga('send', 'pageview');

function trackEvent(action, location) {

	location = location.replace("scene", "Scene ");

	var eventCategory = "Game events"; // file all Pic'd tracking events under "Game events" instead of "Interactives"

	var eventAction = gameName + ": " + action; // type of event (Click, etc)
	var eventLabel = gameName + ": " + location; // property of action (Splash screen, Win screen, etc)

	if (analyticsOn) {
		ga('send', 'event', eventCategory, eventAction, eventLabel);
	}
}