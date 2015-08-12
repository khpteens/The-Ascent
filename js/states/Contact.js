// Contact.js

var Climb = Climb || {};

//loading the game assets
Climb.Contact = function() {};

Climb.Contact.prototype = {
	init: function() {
		this.game.world.resize(settings.WIDTH, settings.HEIGHT);
	},
	create: function() {

		createBG(0x483D8B);
		createCopyright();

		var text = "Give us a shout";
		var t = this.game.add.text(this.game.world.centerX, this.game.height / 2 - 200, text, h1_style);
		t.anchor.set(0.5);

		text = "Got something on your mind?\nContact one of our counsellors.";
		var sub = this.game.add.text(this.game.world.centerX, this.game.height / 2 - 135, text, h3_style);
		sub.anchor.set(0.5);

		var messageButtonH = this.game.height / 2 - 30,
			phoneButtonH = this.game.height / 2 + 30;

		// Live Chat
		if (chatOpen) {
			text = chatOpen_txt[0];			
		} else {
			text = chatClosed_txt[0];
			messageButtonH = this.game.height / 2 + 30,
			phoneButtonH = this.game.height / 2 - 30;
		}
		var MessageBt = this.game.add.sprite(this.game.width / 2, messageButtonH, "square");
		createBt(MessageBt, text, false, false, "icon-chat");
		MessageBt.events.onInputUp.add(function() {
			message_brotalk();
		}, this);

		// Phone
		text = "Phone a counsellor";
		var PhoneBt = this.game.add.sprite(this.game.width / 2, phoneButtonH, "square");
		createBt(PhoneBt, text, false, false, "icon-phone");
		PhoneBt.events.onInputUp.add(function() {
			phone_brotalk();
		}, this);

		// More info
		text = counsellor_txt[0];
		var PhoneBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 90, "square");
		createBt(PhoneBt, text, false);
		PhoneBt.events.onInputUp.add(function() {
			moreAbout();
		}, this);

		// Phone
		var BackBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 210, "square");
		createBt(BackBt, "Main menu", "MainMenu");

	},
	update: function() {}
};

function phone_brotalk() {
	var r = confirm("Are you sure you want to dial Kids Help Phone's number?");
	if (r === true) {
		window.location = phone_url;
	} else {
		// do nothing if cancel is pressed
	}
}

function message_brotalk() {
	var r = confirm("Are you sure you want to leave this page?");
	if (r === true) {
		openInNewTab(chat_url);
	} else {
		// do nothing if cancel is pressed
	}
}

function moreAbout() {
	var r = confirm("Are you sure you want to leave this page?");
	if (r === true) {
		openInNewTab(counsellor_url);
	} else {
		// do nothing if cancel is pressed
	}
}