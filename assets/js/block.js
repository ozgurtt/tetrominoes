// A Block is composed of squares put together. A Block can have one out of
// seven configurations. It stores the size of one square, the position of its
// squares and the position of its 'center-square' used for the rotations, its
// type, and the grid it belongs to. A Block also stores the array of the
// corresponding sprites in the display.
function Block(grid, typeOfBlock, squareSize) {
  // public properties
  this.squaresInGrid = []; // The positions of the block's squares when it appears on screen
  this.centerX = grid.w / 2 - 1; // position of the center on the horizontal axis
  this.centerY = 1; // position of the center on the vertical axis
  this.squaresSprites = [];
  this.squareSize = squareSize;
  this.grid = grid;
  this.typeOfBlock = typeOfBlock;

  // Private constructor which sets up, depending on the type of the block, the
  // position of its squares when the block appears on screen.
  var __construct = function(that) {
    // Blocks appear low enough so that they can rotate and still be
    // completely visible
    // The grid is assumed to have an even number of squares horizontally
    // Types O and I come exactly centered.
    switch (typeOfBlock) {
      case 0: // Type L (appears lying, not standing)
        that.squaresInGrid.push({x: that.centerX,y: 1});
        that.squaresInGrid.push({x: that.centerX - 1,y: 1});
        that.squaresInGrid.push({x: that.centerX + 1,y: 1});
        that.squaresInGrid.push({x: that.centerX - 1,y: 2});
        break;
      case 1: // Type T
        that.squaresInGrid.push({x: that.centerX,y: 1});
        that.squaresInGrid.push({x: that.centerX - 1,y: 1});
        that.squaresInGrid.push({x: that.centerX + 1,y: 1});
        that.squaresInGrid.push({x: that.centerX,y: 2});
        break;
      case 2: // Type S
        that.squaresInGrid.push({x: that.centerX,y: 1});
        that.squaresInGrid.push({x: that.centerX + 1,y: 1});
        that.squaresInGrid.push({x: that.centerX,y: 2});
        that.squaresInGrid.push({x: that.centerX - 1,y: 2});
        break;
      case 3: // Type Z
        that.squaresInGrid.push({x: that.centerX,y: 1});
        that.squaresInGrid.push({x: that.centerX - 1,y: 1});
        that.squaresInGrid.push({x: that.centerX,y: 2});
        that.squaresInGrid.push({x: that.centerX + 1,y: 2});
        break;
      case 4: // Type I (appears lying not standing)
        that.squaresInGrid.push({x: that.centerX,y: 2});
        that.squaresInGrid.push({x: that.centerX - 1,y: 2});
        that.squaresInGrid.push({x: that.centerX + 1,y: 2});
        that.squaresInGrid.push({x: that.centerX + 2,y: 2});
        that.centerY = 2;
        break;
      case 5: // Type O
        that.squaresInGrid.push({x: that.centerX,y: 1});
        that.squaresInGrid.push({x: that.centerX + 1,y: 1});
        that.squaresInGrid.push({x: that.centerX + 1,y: 2});
        that.squaresInGrid.push({x: that.centerX,y: 2});
        break;
      case 6: // Type J (appears lying, not standing)
        that.squaresInGrid.push({x: that.centerX,y: 1});
        that.squaresInGrid.push({x: that.centerX - 1,y: 1});
        that.squaresInGrid.push({x: that.centerX + 1,y: 1});
        that.squaresInGrid.push({x: that.centerX + 1,y: 2});
        break;
    };
  }(this);

};

// Block.display(game) makes a new block visible on top of the grid.
Block.prototype.display = function(game) {
  for (var i = this.squaresInGrid.length - 1; i >= 0; i--) {
    this.squaresSprites[i] = game.add.sprite(this.squaresInGrid[i].x * this.squareSize, this.squaresInGrid[i].y * this.squareSize, 'square');
  };
};

// Block.rotate(angle) rotates a block.
// The value of 'angle' is supposed to be +PI/2 or -PI/2
Block.prototype.rotate = function(angle) {
  if (this.typeOfBlock == 5) return true; // Squares do not change when rotated.
  var rotatedSquares = vector = rotVector = [];
  for (var i = this.squaresInGrid.length - 1; i >= 0; i--) {
    var cos = Math.round(Math.cos(angle));
    var sin = Math.round(Math.sin(angle));
    vector = [this.squaresInGrid[i].x - this.centerX , this.squaresInGrid[i].y - this.centerY];
    rotVector = [vector[0] * cos - vector[1] * sin , vector[1] * cos + vector[0] * sin];
    rotatedSquares[i] = {'x': this.centerX + rotVector[0] , 'y': this.centerY + rotVector[1]};
  };
  this.squaresInGrid = rotatedSquares;
  // Display the changes.
  for (var i = this.squaresSprites.length - 1; i >= 0; i--) {
    this.squaresSprites[i].x = this.squaresInGrid[i].x * this.squareSize;
    this.squaresSprites[i].y = this.squaresInGrid[i].y * this.squareSize;
  };
  return true;
};

// Block.move(dir) moves a block into the given 'dir'-ection.
// Block is only moved if it will not collide with border or other block.
// Returns 'false' if the move was not possible because of a collision.
Block.prototype.move = function(dir) {
  var dx, dy;
  switch (dir) {
    case 'down' :
      dx = 0;
      dy = 1;
      break;
    case 'left' :
      dx = -1;
      dy = 0;
      break;
    case 'right' :
      dx = 1;
      dy = 0;
      break;
  };
  // Create Array of squares for moved Block.
  var movedSquares = [];
  for (var i = this.squaresInGrid.length - 1; i >= 0; i--) {
    movedSquares[i] = {'x': this.squaresInGrid[i].x + dx,'y': this.squaresInGrid[i].y + dy};
    // If it collides with an element in the grid do logic and exit.

    // if (member(this.squareSize * movedSquares[i].x , this.squareSize * movedSquares[i].y, this.grid.squares)) {
    console.log(movedSquares[i].y);
    if(this.grid.lines[movedSquares[i].y] != undefined){
    if (this.grid.lines[movedSquares[i].y].elts[movedSquares[i].x] != undefined) {
      // Add the block squares to the grid.
      for (var j = this.squaresInGrid.length - 1; j >= 0; j--) {
        this.grid.squares.push(this.squaresSprites[j]);
        this.grid.addToLine(this.squaresSprites[j].y / this.squareSize, this.squaresSprites[j].x / this.squareSize, this.squaresSprites[j]);
        // this.grid.lines[this.squaresSprites[j].y / this.squareSize].elts[this.squaresSprites[j].x / this.squareSize] = (this.squaresSprites[j]);

      };
      this.grid.handleFullLines(this);
      return false;
    };
  };
    // If the bottom line would be crossed, do logic and exit.
    if (movedSquares[i].y >= this.grid.h) {
      // Add the block squares to the grid.
      for (var j = this.squaresInGrid.length - 1; j >= 0; j--) {
        this.grid.squares.push(this.squaresSprites[j]);
        this.grid.addToLine(this.squaresSprites[j].y / this.squareSize, this.squaresSprites[j].x / this.squareSize, this.squaresSprites[j]);
        // this.grid.lines[this.squaresSprites[j].y / this.squareSize][this.squaresSprites[j].x / this.squareSize] = (this.squaresSprites[j]);
      }
      this.grid.handleFullLines(this);
      return false;
    }
    // If the left and right boundaries would be crossed, do nothing and exit.
    if (movedSquares[i].x >= this.grid.w || movedSquares[i].x < 0) {
      return false;
    };
  };
  // It doesn't collide, and stays within boundaries so we change the
  // coordinates of the squares in the grid.
  this.squaresInGrid = movedSquares;
  this.centerX += dx;
  this. centerY += dy;
  // display the changes
  for (var i = this.squaresSprites.length - 1; i >= 0; i--) {
    this.squaresSprites[i].x += dx * this.squareSize;
    this.squaresSprites[i].y += dy * this.squareSize;
  };
  return true;
};

// Function to test if the object {x:elt1, y:elt2] is a member of the array arr.
// ( arr.indexOf({x: elt1, y:elt2}) didn't seem to work. )
function member(elt1, elt2, arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i].x == elt1 && arr[i].y == elt2) return true;
  };
  return false;
}
