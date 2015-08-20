// game.js
var Climb = Climb || {};

// sprites
var T, E, A, M, //  climber
    tT, tE, tA, tM, //  climber letters
    timer,
    goat;

// inputs
var T_Key, E_Key, A_Key, M_Key, Left_Key, Right_Key;
var T_button, E_button, A_button, M_button, toggleLR;

var ropeArt = null;

// groups
var climbers, platforms, ropes, optionsScreen, winMessage, userinterface, touchinterface, background, rope_group, pads, goats;

var tPad, ePad, aPad, mPad, tPad2, ePad2, aPad2, mPad2;

// arrays
var team = [];
var buttons = [];

// constants
var GRAVITY = 225;
var X_MOVE = 110;
var X_MOVE_EDGE = X_MOVE / 2;
var Y_CLIMB = -80;
var Y_HOP = -25;
var goat_respawn = true;

var ROPE_WIDTH = 5;

var topPlatform;
var currentTime;
var gameStarted = false,
    gameComplete = false,
    gamePaused;
var timeStart,
    timeEnd,
    timeBefore,
    timePaused;
var pauseStart;
var winText;

var o_camera,
    cameraDrag = 5,
    cameraAccel = 3,
    camVelX = 0,
    camVelY = 0,
    camMaxSpeed = 80,
    camTween,
    teamCenter;


Climb.Game = function() {};
Climb.Game.prototype = {
    init: function() { // Called as soon as we enter this state  
        team = [];
        gameStarted = false;
        gameComplete = false;
        gamePaused = false;
        timePaused = 0;

        this.game.world.resize(1400, 1200);
        this.game.camera.x = 0;
        this.game.camera.y = this.game.world.height;
    },
    preload: function() { // Assets to be loaded before create() is called        
    },
    create: function() { // Adding sprites, sounds, etc...

        teamCenter = new Phaser.Point(0, 0);

        this.game.physics.startSystem(Phaser.Physics.ARCADE); //  Arcade Physics system GO!!!

        createBackground();
        createPlatforms();
        createPads();
        createClimbers();
        createRopes();
        create_goats();

        createWinText();
        createTimer();

        createOptionsScreen();

        camera_center();
        camera_follow_team();

        createCopyright();
    },
    update: function() { // Game logic, collision, movement, etc...

        if (!gamePaused) {

            updateClimbers();
            updateTimer();
            update_goats();

            // camera related
            camera_center();
            camera_follow_team();

            if (!gameComplete) {
                gameCheckWin();
            }
        }
    }
};

function create_goats() {

    goats = Climb.game.add.group();

    var gNum = 1;
    for (var i = 0; i < gNum; i++) {
        create_goat(i);
    }
}

function create_goat(i) {

    var g = Climb.game.add.sprite(50, 0, "fpo-circle");
    g.anchor.set(0, 1);
    g.width = g.height = 10;
    g.alpha = 0;

    g.art = Climb.game.add.sprite(g.x, g.y, "goat");
    g.art.anchor.set(0.5, 1);
    g.art.width = g.art.height = 60;

    // physics
    Climb.game.physics.arcade.enable([g]);
    g.body.gravity.y = GRAVITY;
    g.body.bounce.set(0.2);

    goats.add(g);

    var randomDelay = Math.round(Math.random() * 1200);
    setTimeout(function() {
        reset_goat(g);
    }, randomDelay);
}

function update_goats() {
    for (var i = 0, len = goats.length; i < len; i++) {
        update_goat(goats.children[i]);
    }
}

function update_goat(g) {

    g.art.x = g.x;
    g.art.y = g.y;

    if (g.lastX != undefined && g.lastX == g.x && g.grounded) {
        g.body.velocity.y = -150;
    }
    g.lastX = g.x;
    g.grounded = false;

    Climb.game.physics.arcade.collide(goats, platforms, update_goat_platform, null, this); //  Collide with platforms    
}

function update_goat_platform(g, p) {

    g.grounded = true;

    if (g.x > 1400 || g.x < -100) {
        reset_goat(g);
    } else {

        if (Math.abs(g.body.velocity.x) < 30) g.body.velocity.x += g.vX; // max at 
        g.body.velocity.y += g.vY;
    }
}

function reset_goat(g) {

    if (goat_respawn) {
        g.x = Math.round(Math.random() * 1000) + 200; // starting X position between 200 and 1200   
        g.y = 0;

        var randPosNeg = Math.round(Math.random()) * 2 - 1;
        g.art.width = Math.abs(g.art.width) * randPosNeg * (-1);
        g.vX = randPosNeg * 2;
        g.vY = -3;

        g.body.velocity.x = 0;
        g.body.velocity.y = 0;
    }
}

function clear_goats() {
    var len = goats.length;
    for (var i = len-1; i >= 0 ; i--) {
    
        if(goats.children[i] != null){ // destroy from last to first elements in array
            goats.children[i].art.destroy();             
            goats.children[i].destroy();                     
        }
    }    
    goats = [];
}

function createPads() {

    pads = Climb.game.add.group();
    pads.enableBody = true;

    // starting pads
    tPad = Climb.game.add.sprite(40, 1096, "fpo-square");
    createPad(tPad, "T", 0xfc6744);

    ePad = Climb.game.add.sprite(110, 1096, "fpo-square");
    createPad(ePad, "E", 0x4ac7eb);

    aPad = Climb.game.add.sprite(180, 1096, "fpo-square");
    createPad(aPad, "A", 0xc1cd23);

    mPad = Climb.game.add.sprite(250, 1096, "fpo-square");
    createPad(mPad, "M", 0x938884);

    // ending pads
    tPad2 = Climb.game.add.sprite(1000, 396, "fpo-square");
    createPad(tPad2, "T", 0xfc6744);

    ePad2 = Climb.game.add.sprite(1070, 396, "fpo-square");
    createPad(ePad2, "E", 0x4ac7eb);

    aPad2 = Climb.game.add.sprite(1140, 396, "fpo-square");
    createPad(aPad2, "A", 0xc1cd23);

    mPad2 = Climb.game.add.sprite(1210, 396, "fpo-square");
    createPad(mPad2, "M", 0x938884);
}

function createPad(p, n, t) {

    p.width = 69;
    p.height = 10;
    p.name = n;
    p.tint = t;
    p.anchor.set(0.5, 1);
    p.name = String(p);
    pads.add(p);
}

function createOptionsScreen() {

    optionsScreen = Climb.game.add.group(); // create a group to contain all option screen elements
    optionsScreen.fixedToCamera = true;

    var text;

    // create background
    var optionBg = Climb.game.add.graphics(0, 0);
    optionBg.beginFill(0x938884, 1);
    optionBg.boundsPadding = 0;
    optionBg.drawRect(0, 0, settings.WIDTH, settings.HEIGHT);
    optionBg.alpha = 0.9;
    optionBg.inputEnabled = true;
    optionsScreen.add(optionBg);

    // "Options"
    text = "Options",
        optionTitle = Climb.game.add.text(settings.WIDTH / 2, settings.HEIGHT / 2 - 200, text, h1_style);
    optionTitle.anchor.set(0.5);
    optionsScreen.add(optionTitle);

    // "Your game is paused"
    text = "Your game has been paused.";
    optionSub = Climb.game.add.text(settings.WIDTH / 2, settings.HEIGHT / 2 - 140, text, h3_style);
    optionSub.anchor.set(0.5);
    optionsScreen.add(optionSub);

    var ResumeBt = Climb.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 - 40, "square");
    createBt(ResumeBt, "Resume", false);
    ResumeBt.events.onInputUp.add(function() {
        optionsHide();
    }, this);
    optionsScreen.add(ResumeBt);
    optionsScreen.add(ResumeBt.label);
    optionsScreen.add(ResumeBt.border);

    var RestartBt = Climb.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 + 20, "square");
    createBt(RestartBt, "Restart", false);
    RestartBt.events.onInputUp.add(function() {
        optionsHide();
        gameRestart();
    }, this);
    optionsScreen.add(RestartBt);
    optionsScreen.add(RestartBt.label);
    optionsScreen.add(RestartBt.border);

    var ExitBt = Climb.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 + 140, "square");
    createBt(ExitBt, "Main menu", "MainMenu");
    optionsScreen.add(ExitBt);
    optionsScreen.add(ExitBt.label);
    optionsScreen.add(ExitBt.border);

    var InstructionsBt = Climb.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 + 200, "square");
    createBt(InstructionsBt, "How to play", "Instructions");
    optionsScreen.add(InstructionsBt);
    optionsScreen.add(InstructionsBt.label);
    optionsScreen.add(InstructionsBt.border);

    var optionCloseBt = Climb.game.add.sprite(settings.WIDTH - 29, 29, "square");
    createBt(optionCloseBt, "icon-x", false, "circle");
    optionCloseBt.events.onInputUp.add(function() {
        optionsHide();
    }, this);
    optionsScreen.add(optionCloseBt);
    optionsScreen.add(optionCloseBt.label);
    optionsScreen.add(optionCloseBt.border);

    optionsScreen.visible = false;
}

function optionsShow() {

    gamePause(true);
    optionsScreen.visible = true;
}

function optionsHide() {

    gamePause(false);
    optionsScreen.visible = false;
}

function gamePause(myBoolean) {

    gamePaused = myBoolean; // set global pause variable

    if (myBoolean) { // pause game
        for (var i = 0; i < 4; i++) {
            team[i].body.allowGravity = !myBoolean; // turn off gravity
            team[i].currentVelocity = team[i].body.velocity; // save currentVelocity
            team[i].body.velocity = 0; // kill sprite's actual velocity
        }
        pauseTimer();

    } else { // unpause game
        for (var i = 0; i < 4; i++) {
            team[i].body.allowGravity = !myBoolean; // turn on gravity
            team[i].body.velocity = team[i].currentVelocity; // apply saved velocity value
        }
        unpauseTimer();
    }
}

function createWinText() {

    winMessage = Climb.game.add.group();
    winMessage.fixedToCamera = true;

    var overlay = Climb.game.add.graphics(0, 0);
    overlay.inputEnabled = true;
    overlay.beginFill(0x000000, 1);
    overlay.boundsPadding = 0;
    overlay.drawRect(0, Climb.game.height / 2 - 130, Climb.game.width, 325);
    overlay.alpha = 0.6;
    winMessage.add(overlay);

    // create and add text sprite telling the player they have won    
    var text = "Your team has\nreached the summit!"
    winText = Climb.game.add.text(settings.WIDTH / 2, settings.HEIGHT / 2 - 40, text, h2_style);
    winText.anchor.set(0.5);
    winMessage.add(winText);

    // Continue button
    ContinueBt = Climb.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 + 60, 'square');
    createBt(ContinueBt, "Continue", "Finish");
    winMessage.add(ContinueBt);
    winMessage.add(ContinueBt.label);
    winMessage.add(ContinueBt.border);

    // Restart button
    AgainBt = Climb.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 + 120, 'square');
    createBt(AgainBt, "Restart", false);
    AgainBt.events.onInputUp.add(function() {
        winMessage.visible = false;
        gameRestart();
    }, this);
    winMessage.add(AgainBt);
    winMessage.add(AgainBt.label);
    winMessage.add(AgainBt.border);

    winMessage.visible = false;
}

function createBackground() {

    Climb.game.stage.backgroundColor = '#4ac7eb';
    background = Climb.game.add.group();

    var mountains = background.create(0, 0, "bg-mountains");
    mountains.height = settings.HEIGHT;
    mountains.anchor.set(0.5, 0);
    background.fixedToCamera = true;
}

function createPlatforms() {

    platforms = Climb.game.add.group(); //  The platforms group contains the ground and the 3 ledges we can jump on
    platforms.enableBody = true;

    // ground
    var ground = platforms.create(-100, Climb.game.world.height - 100, 'square'); // Here we create the ground.
    ground.width = Climb.game.world.width + 200;
    ground.height = 100;
    ground.body.immovable = true;
    ground.tint = groundColour;
    ground.name = "ground";
    ground.alpha = 0; // hide platform

    createPlatform(300, 1000, 1100, 1);
    createPlatform(400, 900, 150, 1);
    createPlatform(650, 900, 750, 1);
    createPlatform(800, 700, 600, 2);
    createPlatform(900, 400, 500, 3);

    topPlatform = platforms.children[5]; // 5

    var platformArt = Climb.game.add.sprite(0, Climb.game.world.height + 45, "fg-mountains");
    platformArt.anchor.set(0, 1);
}

function createPlatform(x, y, width, hx) {

    var hc = 100,
        h = hx * 100,
        n = platforms.children.length,

        ledge = platforms.create(x, y, 'square');

    ledge.name = "ledge" + n;
    ledge.width = width;
    ledge.height = h;
    ledge.hx = hx;
    ledge.ropes = [];
    ledge.body.immovable = true;
    ledge.alpha = 0; // hide platform, will show only artwork for platforms
}

function createClimbers() {

    climbers = Climb.game.add.group();
    climbers.enableBody = true;

    var startX = Climb.game.world.height - 300;

    T = climbers.create(40 - 36, startX, 'av-t');
    T.key = T_Key;
    T.button = T_button;
    T.name = "T";
    createClimber(T);

    E = climbers.create(110 - 36, startX, 'av-e');
    E.key = E_Key;
    E.button = E_button;
    E.name = "E";
    createClimber(E)

    A = climbers.create(180 - 36, startX, 'av-a');
    A.key = A_Key;
    A.button = A_button;
    A.name = "A";
    createClimber(A);

    M = climbers.create(250 - 36, startX, 'av-m');
    M.key = M_Key;
    M.button = M_button;
    M.name = "M";
    createClimber(M);

    createInputs();
}

function createClimber(c) {

    //  settings
    c.width = 72;
    c.height = 100;
    c.body.collideWorldBounds = true;
    c.body.gravity.y = GRAVITY;
    c.tint = defaultColour;

    //  climber flags
    c.platform = platforms.children[0];
    c.rope;
    c.moving = false;
    c.lastX = c.x;
    c.lastY = c.y;
    c.keyUp = false;
    c.keyDown = false;
    c.holdingUp = [];
    c.frame = 1;

    // define animations (name, frame range, framerate, loop, ?)
    c.animations.add('hop', [3, 4, 5, 6, 7, 8, 9], 30, false);

    team.push(c); //  save reference in team array.        
}

function createRopes() {
    // create group
    ropes = Climb.game.add.group();
    ropes.enableBody = true;
}

function createRope(c) {

    var p = c.platform;
    var len = p.ropes.length;

    // add a new rope only if less than maximum needed (don't need 3 ropes to get up a cliff that is 2 ropes high)
    if (len < c.platform.hx) {

        var rx = c.platform.x - ROPE_WIDTH * 2,
            ry;

        if (len === 0) {
            ry = c.y + c.height / 2;
        } else {
            ry = p.ropes[len - 1].rope.y + 100;
            rx = p.ropes[len - 1].rope.x;
        }

        var rope = ropes.create(rx, ry, 'square');

        rope.tint = 0x8B4513; // brown
        rope.width = ROPE_WIDTH;
        rope.height = c.height;
        rope.climber = c;
        rope.platform = p;
        c.rope = rope;
        c.platform.ropes.push(c);
        rope.alpha = 0;

        beautifyRopes();
    }
}

function beautifyRopes() {

    if (ropeArt != null) {
        ropeArt.destroy();
        ropeArt = undefined;
    }

    if (ropes.children.length > 0) { // if any ropes then draw them

        var r, c, p;

        for (var i = 0, len = ropes.children.length; i < len; i++) { // loop through ropes

            r = ropes.children[i];
            c = r.climber;
            p = c.platform; // get current platform

            rNum = p.ropes.length; // # of ropes on current platform

            if (Math.round(r.climber.rope.y - p.ropes[0].y) === 50) { // draw rope only once per platfom

                var myRx,
                    myRy = p.y - 50 + rNum * 100,
                    cHandsX = p.ropes[0].x + 21, //c.x + 18,
                    cHandsY = c.y + c.height - 18;

                ropeArt = Climb.game.add.graphics(0, 0);
                ropeArt.lineStyle(4, 0x8B4513); // thickness, hex colour of rope
                ropeArt.moveTo(cHandsX, cHandsY); // set start of rope in climber's hands

                if (cHandsX < p.x - 4) {
                    ropeArt.lineTo(cHandsX, myRy);

                } else {
                    myRx = p.x - 4;
                    ropeArt.lineTo(p.x - 4, p.y - 4);
                    ropeArt.lineTo(myRx, myRy);
                }
            }
        }


    } else {
        // do nothing        
    }
}

function rebuildRope(p) {

    // loop through ropes,     
    // 1. shift existing rope sprites to hang from the first climber in rope chain (up to maximum allowed). 

    var len = p.ropes.length;
    var c, r;
    var firstRopeY;

    for (var i = 0; i < len; i++) {

        c = p.ropes[i];
        r = c.rope;

        if (i == 0) {
            firstRopeY = c.y + c.height / 2;
        }

        r.x = p.x - ROPE_WIDTH * 2;
        r.y = firstRopeY + i * c.height;
    }
}

function deleteRope(c) {
    if (c.rope != undefined) {
        c.rope.destroy();
        c.rope = undefined;

        // loop through ropes from this platform
        var p = c.platform;
        var len = p.ropes.length;
        var s;
        for (var i = 0; i < len; i++) {
            if (p.ropes[i] == c) {
                s = i;
            }
        }

        // remove reference to rope from platform's ropes array
        if (len <= 1) {
            p.ropes = [];
        } else {
            p.ropes.splice(s, 1);
            rebuildRope(p);
        }
    }
    beautifyRopes();
}

function createInputs() {

    createInputKeys();
    createInputButtons();
}

function createInputKeys() {

    T_Key = Climb.game.input.keyboard.addKey(Phaser.Keyboard.T);
    T_Key.onDown.add(keyDown, this);
    T_Key.onUp.add(keyUp, this);
    T_Key.climber = T;
    T.key = T_Key;

    E_Key = Climb.game.input.keyboard.addKey(Phaser.Keyboard.E);
    E_Key.onDown.add(keyDown, this);
    E_Key.onUp.add(keyUp, this);
    E_Key.climber = E;
    E.key = E_Key;

    A_Key = Climb.game.input.keyboard.addKey(Phaser.Keyboard.A);
    A_Key.onDown.add(keyDown, this);
    A_Key.onUp.add(keyUp, this);
    A_Key.climber = A;
    A.key = A_Key;

    M_Key = Climb.game.input.keyboard.addKey(Phaser.Keyboard.M);
    M_Key.onDown.add(keyDown, this);
    M_Key.onUp.add(keyUp, this);
    M_Key.climber = M;
    M.key = M_Key;

    // direction keys
    Left_Key = Climb.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    Left_Key.onUp.add(leftKeyUp, this);

    Right_Key = Climb.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    Right_Key.onUp.add(rightKeyUp, this);
}

function createInputButtons() {

    userinterface = Climb.game.add.group();
    userinterface.fixedToCamera = true;

    touchinterface = Climb.game.add.group();
    touchinterface.fixedToCamera = true;

    var y = Climb.game.world.height - 50;

    T_button = Climb.game.add.sprite(50, Climb.game.height - 200, "circle");
    createButton(T_button, T);

    E_button = Climb.game.add.sprite(150, Climb.game.height - 50, "circle");
    createButton(E_button, E);

    A_button = Climb.game.add.sprite(Climb.game.width - 150, Climb.game.height - 50, "circle");
    createButton(A_button, A);

    M_button = Climb.game.add.sprite(Climb.game.width - 50, Climb.game.height - 200, "circle");
    createButton(M_button, M);

    // direction toggle button
    toggleLR = Climb.game.add.sprite(Climb.game.width - 89, 29, "square");
    createBt(toggleLR, "icon-walk-right", false, "circle");
    toggleLR.events.onInputUp.add(toggleDirection, this);
    userinterface.add(toggleLR.group);

    // options button
    optionsBt = Climb.game.add.sprite(Climb.game.width - 29, 29, "square");
    createBt(optionsBt, "icon-menu", false, "circle");
    optionsBt.events.onInputUp.add(optionsShow, this);
    userinterface.add(optionsBt.group);

    if (!Climb.game.device.touch) {
        touchinterface.visible = false;
    }
}

function toggleDirection() {

    X_MOVE = X_MOVE * (-1);
    X_MOVE_EDGE = X_MOVE_EDGE * (-1);

    if (X_MOVE > 0) {
        toggleLR.label.width = Math.abs(toggleLR.label.width);
    } else {
        toggleLR.label.width = toggleLR.label.width * (-1);
    }
}

function leftKeyUp(e) {

    if (X_MOVE > 0) {
        toggleLR.label.width = Math.abs(toggleLR.label.width) * (-1);
        X_MOVE = X_MOVE * (-1);
        X_MOVE_EDGE = X_MOVE_EDGE * (-1);
    } else {

    }
}

function rightKeyUp(e) {

    if (X_MOVE > 0) {

    } else {
        toggleLR.label.width = Math.abs(toggleLR.label.width);
        X_MOVE = X_MOVE * (-1);
        X_MOVE_EDGE = X_MOVE_EDGE * (-1);
    }
}

function toggleDirectionReset() {

    X_MOVE = Math.abs(X_MOVE);
    X_MOVE_EDGE = Math.abs(X_MOVE_EDGE);
    toggleLR.width = Math.abs(toggleLR.width);
}

function createButton(b, c) {

    b.width = 100;
    b.height = 100;
    b.anchor.set(0.5);
    b.alpha = 0.2;

    b.inputEnabled = true;
    b.input.useHandCursor = true;
    b.input.priorityID = buttons.length;

    b.events.onInputDown.add(buttonDown, this);
    b.events.onInputUp.add(buttonUp, this);
    b.climber = c;
    c.button = b;
    buttons.push(b);

    // add border
    var border = Climb.game.add.graphics(0, 0);
    border.lineStyle(2, 0xffffff, 1);
    border.drawCircle(b.x, b.y, b.width, b.height);
    border.boundsPadding = 0;
    border.alpha = 1;
    b.border = border;

    var label = Climb.game.add.text(b.x, b.y, c.name, touch_button_style);
    label.anchor.set(0.5);
    b.label = label; //  save reference to letter

    touchinterface.add(b);
    touchinterface.add(b.border);
    touchinterface.add(b.label);
}

// Timer
function createTimer() {

    timer = Climb.game.add.text(15, 34, "0.00", h2_style);
    timer.anchor.set(0, 0.5);
    userinterface.add(timer);

    best = Climb.game.add.text(17, 58, "BEST: " + bestTime, copyright_style);
    best.anchor.set(0, 0.5);
    // best.visible = false;
    userinterface.add(best);

    if (bestTime == null) {
        best.text = "BEST: 0.0";
    }
}

function startTimer() {

    gameStarted = true;
    timeStart = new Date().getTime() / 1000;
}

function updateTimer() {

    if (gameStarted) {
        if (!gameComplete) {
            var now = new Date().getTime() / 1000;
            currentTime = (now - (timeStart + timePaused)).toFixed(1);
            timer.text = currentTime;
        }
    } else {
        timer.text = "0.0";
    }
}

function pauseTimer() {

    pauseStart = new Date().getTime() / 1000;
}

function unpauseTimer() {

    pauseEnd = new Date().getTime() / 1000;
    if (gameStarted) {
        timePaused = Number((Number(timePaused) + pauseEnd - pauseStart).toFixed(2));
    }
}

function updateClimbers() {

    Climb.game.physics.arcade.collide(climbers, platforms, updateClimberPlatform, null, this); //  Collide with platforms    

    for (var i = 0, len = team.length; i < len; i++) {
        updateClimber(team[i]);
    }
}

function updateClimber(c) {

    //  save previous position
    c.lastX = c.x;
    c.lastY = c.y;

    //  create friction
    if (c.body.velocity.x > 0) { // if moving right
        c.body.velocity.x -= 5;
    } else if (c.body.velocity.x < 0) { // if moving left
        c.body.velocity.x += 5;
    } else {
        c.body.velocity.x = 0; //
    }

    //  set moving flags
    if (c.body.velocity.x !== 0 || c.body.velocity.y !== 0) {
        c.moving = true;
    } else {
        c.moving = false;
        updatePads();
    }

    // input
    if (c.keyUp) { // walk right, climb person or rope  

        deleteRope(c)

        if (c.x < c.platform.x) {
            c.body.velocity.x = X_MOVE_EDGE;
        } else {
            c.body.velocity.x = X_MOVE;
        }

        if (c.body.touching.down) { // only if touching down
            c.body.velocity.y += Y_HOP;
        }

        Climb.game.physics.arcade.overlap(c, climbers, overlapClimbersKeyUp);
        Climb.game.physics.arcade.overlap(c, ropes, overlapRope);

    } else if (c.keyDown) {

        if (!c.moving && c.x < c.platform.x && c.rope === undefined) {
            createRope(c);
            beautifyRopes();
        }
        Climb.game.physics.arcade.overlap(c, climbers, overlapClimbersKeyIsDown);
    }

    updateClimberHoldingUpList(c);

    updateClimberDisplay(c);
}

function updatePads() {

    if (!T.moving) {
        Climb.game.physics.arcade.overlap(T, tPad, function() {
            T.frame = 0;
        });
        Climb.game.physics.arcade.overlap(T, tPad2, function() {
            T.frame = 0;
        });
    }

    if (!E.moving) {
        Climb.game.physics.arcade.overlap(E, ePad, function() {
            E.frame = 0;
        });
        Climb.game.physics.arcade.overlap(E, ePad2, function() {
            E.frame = 0;
        });
    }
    if (!A.moving) {
        Climb.game.physics.arcade.overlap(A, aPad, function() {
            A.frame = 0;
        });
        Climb.game.physics.arcade.overlap(A, aPad2, function() {
            A.frame = 0;
        });
    }

    if (!M.moving) {
        Climb.game.physics.arcade.overlap(M, mPad, function() {
            M.frame = 0;
        });
        Climb.game.physics.arcade.overlap(M, mPad2, function() {
            M.frame = 0;
        });
    }
}

function updateClimberHoldingUpList(c) {

    for (var i = 0, len = c.holdingUp.length; i < len; i++) { // loop through climber's in "holdingUp" list

        var o = c.holdingUp[i];
        // check for x position overlap
        if (o.x > c.x + c.width || o.x < c.x - c.width) { // if too far right or too far left then enable gravity
            o.body.allowGravity = true; // enable gravity
        }
    }
}

function updateClimberDisplay(c) {

    // update display state
    if (c.keyDown) {

        if (c.isPlaying) c.animations.stop('hop');

        if (c.rope !== undefined) { // holding rope
            c.frame = 12;

        } else if (!c.moving && c.rope === undefined) { // lifting
            c.frame = 2;

        } else if (!c.moving) { // hopping

            c.animations.play('hop');
            c.animations.currentAnim.onComplete.addOnce(function() {
                c.frame = 1;
            }, this);

        } else { // climbing
            // c.animations.play('hop');
            // c.animations.currentAnim.onComplete.addOnce(function(){
            //     c.frame = 1;
            // }, this);
            // c.frame = 0;
        }

        // if (c.tint !== isDownColour) c.tint = isDownColour;
    } else if (c.keyUp) {

        climbers.bringToTop(c);

        c.animations.play('hop');
        c.animations.currentAnim.onComplete.addOnce(function() {
            c.frame = 1;
        }, this);
        // if (c.frame !== 1) c.frame = 1;
        // if (c.tint !== defaultColour) c.tint = defaultColour;

        c.keyUp = false; // fire keyUp actions only once.        
    }
}

function updateClimberPlatform(c, p) {

    if (!c.moving && c.platform != p && c.y + 50 < p.y) {

        c.platform = p;
        gameCheckWin();
    }
}

function overlapClimbersKeyUp(c, other) { // this function is triggered once, on keyUp
    //  control ACTIVE climber  

    //  Release all climbers held up by this one
    for (var i = 0, len = c.holdingUp.length; i < len; i++) { // loop through climbers in "holdingUp" list

        c.holdingUp[i].body.allowGravity = true;
        other.body.velocity.y = -20; // short boost so climber can be held up by a different climber
        other.moving = true;
    }
    c.holdingUp = [];

    if (c !== other) { // avoid colliding with self

        //  recieve a boost only from a stationary climber        
        if (!other.moving && other.keyDown && other.rope === undefined) { //  other is a stationary climber

            if (c.moving && Math.abs(c.x - other.x) <= c.width / 2) {
                c.body.velocity.y = Y_CLIMB; // boost the climber
                c.body.velocity.x = X_MOVE / 2;
            }
        }

    } else {}
}

function overlapClimbersKeyIsDown(c, other) { //  triggered every frame that c.key.isDown

    //  control HELPER climber
    if (c !== other) { // avoid calculating collision with self

        if (!c.moving && c.keyDown) { //  if climber is stationary and their key is held down AND they are on a platform

            //  currently overlapping, 
            //  if the previous position was above

            if (other.y <= c.y - other.height) { // if the other is above 

                other.y = c.y - other.height;
                other.body.velocity.y = 0;
                other.body.allowGravity = false;

                c.holdingUp.push(other); // add to "holdingUp" list
                other.moving = false;

            } else {}

        } else {

        }
    }
}

function overlapRope(c, rope) {

    c.body.allowGravity = true;
    c.body.velocity.y = Y_CLIMB;
    c.moving = true;
}

function gameRestart() {

    clear_goats();
    create_goats();

    winText.visible = false;
    if (Climb.game.device.touch) touchinterface.visible = true; // show touch interface if hasTouch    

    Climb.game.camera.x = 0;
    Climb.game.camera.y = Climb.game.world.height - settings.HEIGHT;

    T.x = T.lastX = 40 - 36;
    T.y = T.lastY = Climb.game.world.height - 300;
    T.platform = 'ground';
    E.x = E.lastX = 110 - 36;
    E.y = E.lastY = Climb.game.world.height - 300;
    E.platform = 'ground';
    A.x = A.lastX = 180 - 36;
    A.y = A.lastY = Climb.game.world.height - 300;
    A.platform = 'ground';
    M.x = M.lastX = 250 - 36;
    M.y = M.lastY = Climb.game.world.height - 300;
    M.platform = 'ground';

    userinterface.visible = true;
    toggleDirectionReset();

    gameStarted = false;
    gameComplete = false;

    timer.text = "0.00";
    timePaused = 0;
}

function gameCheckWin() {

    // loop through climbers, if they are all on the top Platform then "WIN!!!"
    var win = true;
    var i, len = climbers.children.length;

    for (var i = 0; i < len; i++) {
        if (climbers.children[i].platform != topPlatform) {
            win = false;
        }

        if (T.frame != 0 || E.frame != 0 || A.frame != 0 || M.frame != 0) {
            win = false;
        }
    }

    if (win) {
        gameWin();
    }
}

function gameWin() {

    if (ropeArt != null) {
        ropeArt.destroy();
        ropeArt = undefined;
    }
    clear_goats();

    // show win message with continue button
    winMessage.visible = true;
    if (touchinterface.visible) touchinterface.visible = false;
    userinterface.visible = false;

    gameComplete = true;

    if (Number(currentTime) <= bestTime || bestTime == null) {
        bestTime = currentTime;
        best.text = "BEST: " + bestTime;
    }
}

// Input functions (Keyboard,Buttons)
function keyDown(e) {

    var c = e.climber;
    c.keyUp = false;
    c.keyDown = true;
    climbers.bringToTop(c);
    c.button.tint = isDownColour;
}

function keyUp(e) {

    var c = e.climber;
    c.keyDown = false;
    c.keyUp = true;
    c.body.allowGravity = true;
    c.button.tint = noColour;

    if (!gameStarted) startTimer();
}

function buttonDown(e) {

    var c = e.climber;
    c.keyUp = false;
    c.keyDown = true;
    e.tint = isDownColour;
}

function buttonUp(e) {

    var c = e.climber;
    c.keyDown = false;
    c.keyUp = true;
    e.tint = noColour;

    if (!gameStarted) startTimer();
}

function camera_center() {

    if (T.x) {

        var top = T.y,
            bottom = T.y,
            left = T.x,
            right = T.x,
            myY, myX;
        for (var i = 0, l = team.length; i < l; i++) {
            myY = team[i].y;
            myX = team[i].x;
            if (myY < top) top = myY;
            if (myY > bottom) bottom = myY;
            if (myX < left) left = myX;
            if (myX > right) right = myX;
        }

        teamCenter.x = ((left + right) / 2) - settings.WIDTH / 2;
        teamCenter.y = ((top + bottom) / 2) - settings.HEIGHT / 2;
    }
}

function camera_follow_team() {

    var camX = Climb.game.camera.x,
        camY = Climb.game.camera.y,
        tarX = teamCenter.x,
        tarY = teamCenter.y;
    var speed = 0.05;

    if (Math.abs(camX - tarX) > 0.1 && Math.abs(camY - tarY) > 0.1) {
        Climb.game.camera.x = camX + (tarX - camX) * speed;
        Climb.game.camera.y = camY + (tarY - camY) * speed;
    }
}

function drag_camera(o_pointer) {
    if (!o_pointer.timeDown) {
        return;
    }
    if (o_pointer.isDown && !o_pointer.targetObject) {
        if (o_camera) {
            camVelX = (o_camera.x - o_pointer.position.x) * cameraAccel;
            camVelY = (o_camera.y - o_pointer.position.y) * cameraAccel;
        }
        o_camera = o_pointer.position.clone();
    }

    if (o_pointer.isUp) {
        o_camera = null;
    }
}

function update_camera() {
    camVelX = clamp(camVelX, camMaxSpeed, -camMaxSpeed);
    camVelY = clamp(camVelY, camMaxSpeed, -camMaxSpeed);

    Climb.game.camera.x += camVelX;
    Climb.game.camera.y += camVelY;

    //Set Camera Velocity X Drag
    if (camVelX > cameraDrag) {
        camVelX -= cameraDrag;
    } else if (camVelX < -cameraDrag) {
        camVelX += cameraDrag;
    } else {
        camVelX = 0;
    }

    //Set Camera Velocity Y Drag
    if (camVelY > cameraDrag) {
        camVelY -= cameraDrag;
    } else if (camVelY < -cameraDrag) {
        camVelY += cameraDrag;
    } else {
        camVelY = 0;
    }
}

function clamp(val, max, min) {
    var value = val;

    if (value > max) value = max;
    else if (value < min) value = min;

    return value;
}

//  });