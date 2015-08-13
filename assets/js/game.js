var currentKey, lastKey, holdDownDelay, holdDownFirstDelay, framesTillNextMove,
framesTillNextRot, turnCWkey, turnCCWkey, downKey, leftKey, rightKey, grid,
fallingBlock, squareSize, gridWidth, gridHeight, speed, score, clock, angle;
  
var Game = {

  preload: function() {
    // Load the needed resources for the level.
    game.load.image('square', './assets/images/square.png');
  },

  create : function() {
    // By setting up global variables in the create function, we initialise them
    // on game start. We need them to be globally available so that the update
    // function can alter them.
    fallingBlock = {};
    squareSize = 15; // Blocks are built with 'squareSize' px wide squares.
    gridWidth = 10; // The grid is 'gridWidth' squares wide.
    gridHeight = 18;  // The grid is 'gridHeight' squares high.
    grid = new Grid(gridWidth, gridHeight);
    score = 0;
    clock = speed = 0; // 'clock' goes up 1 with each new frame.
    holdDownFirstDelay = 15; // Delay between 1st and 2nd move when key is hold down.
    holdDownDelay = 5; // Delay between moves after the 2nd move when key is hold down.
    framesTillNextMove = holdDownDelay; 
    rotationDelay = 10; // Delay between two rotations
    framesTillNextRot = rotationDelay;
    // 'lastKey' stores the key that was pressed during the preceding frame and
    // 'currentKey' stores the key that was pressed during the current frame.
    // 'lastKey' and 'currentKey' are only used for moves, not for rotations.
    lastKey = currentKey = {}; 
    angle = 0; 

    // Set up keyboard controls.
    turnCWkey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    turnCCWkey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    // Set up the styles
    game.stage.backgroundColor = '#061f27';
    textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
    textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

    // Generate the first block.
    this.generateCurrentBlock();
    this.fallingBlock.display(game);

    // Display the score.
    // game.add.text(30, 20, "SCORE", textStyle_Key);
    // scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
    
    // Display the speed.
    // game.add.text(80, 20, "SPEED", textStyle_Key);
    // speedTextValue = game.add.text(88, 18, speed.toString(), textStyle_Value);

  },

  update: function() {
  // The update function is called constantly at a high rate

    // Increase a counter on every update call.
    clock++;

    // Handle key presses for moves (translations).
    if (rightKey.isDown)
    {
        currentKey = { direction: 'right', timeDown: rightKey.timeDown };
    }
    else if (leftKey.isDown)
    {
        currentKey = { direction: 'left', timeDown: leftKey.timeDown };
    }
    else if (downKey.isDown)
    {
        currentKey = { direction: 'down', timeDown: downKey.timeDown };
    }
    else {
       currentKey = {};
    };

    // Handle key presses for rotations.
    if (turnCWkey.isDown)
    {
        angle = -Math.PI/2;
    }
    else if (turnCCWkey.isDown)
    {
        angle = Math.PI/2;
    } 
    else {
        angle = 0;        
    };

    // Handle translations when keys are pressed mutiple times compared to 
    // when a key is hold down.
    if(currentKey.direction != undefined) {
        if(lastKey.direction != undefined) {
          if (currentKey.direction == lastKey.direction) {
            if (currentKey.timeDown == lastKey.timeDown) {
                if (framesTillNextMove == 0) {
                    this.fallingBlock.move(currentKey.direction);
                    framesTillNextMove = holdDownDelay;
                } else {
                    framesTillNextMove--;
                };
            } else {
                this.fallingBlock.move(currentKey.direction);
                lastKey.timeDown = currentKey.timeDown;
                framesTillNextMove = holdDownFirstDelay;
            };
          } else {
            this.fallingBlock.move(currentKey.direction);
            lastKey = currentKey;
            framesTillNextMove = holdDownFirstDelay;
          };
      } else {
        this.fallingBlock.move(currentKey.direction);
        lastKey = currentKey;
      };
    };

    // Handle rotations.
    if ( framesTillNextRot == 0 ) {
        if(angle != 0) {
            this.fallingBlock.rotate(angle);
            framesTillNextRot = rotationDelay;
        }
    } else if ( framesTillNextRot > 0 ) {
        framesTillNextRot -= 1;
    };
    
    // Add formula to calculate game speed based on the score.
    // The higher the score, the higher the game speed, with a maximum of 10;
    // speed = Math.min(10, Math.floor(score/50));
    // Update speed value on game screen.
    // speedTextValue.text = '' + speed;
    
    // Do game stuff only if the counter is aliquot to (50 - the game speed).
    // The higher the speed, the more frequently this is fulfilled,
    // making the block move faster.
    if (clock % (50 - speed) == 0) {
      // Move the block down. If impossible, then bottom has been reached and
      // a new block is generated.
      if(! this.fallingBlock.move('down')) {
        this.generateCurrentBlock();
        this.fallingBlock.display(game);
      };
    };


  },

  generateCurrentBlock: function(){
    var typeOfBlock = Math.floor(Math.random() * 6 );
    this.fallingBlock = new Block(grid,typeOfBlock,squareSize);
    return typeOfBlock;
  }

};



