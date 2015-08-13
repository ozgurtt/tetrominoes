// A Grid is defined by its width, its height and the positions of the
// squares left from former blocks.
function Grid (w, h) {
  // // squares stores the coordinates of the squares from former blocks still 
  // // visible in the grid.
  // this.squares = [];
  
  // 'squares' stores the sprites of the squares from former blocks still
  // visible in the grid.
  this.squares = [];
  this.w = w;
  this.h = h;
}

// Grid.handleFullLines(block) checks if there are lines completelly filled
// with squares and erases them if they exist. It takes as an argument a Block
// and  only checks the lines on which this Block has squares. It returns the
// number of lines deleted.
Grid.prototype.handleFullLines = function (block) {
  var linesToCheck = [];
  var linesToDelete = [];
  // Find the y coordinates of the lines where 'block' has a square and
  // store them in 'linesToCheck'.
  for (var i = block.squaresInGrid.length - 1; i >= 0; i--) {
    var y = block.squaresInGrid[i].y;
    if(linesToCheck.indexOf(y) < 0) {
      linesToCheck.push(y);
    };
  };
  // Find out which lines contain a square the whole way through and store
  // their y coordinates in 'linesToDelete'.
  for (var i = linesToCheck.length - 1; i >= 0; i--) {
    var j = this.w - 1;
    for (; j >= 0; j--) {
      if (! member( block.squareSize * j , block.squareSize * linesToCheck[i] , this.squares) ) {
        break;
      } 
    };
    if (j == -1) linesToDelete.push(linesToCheck[i]);
  };
  console.log("ltd" + linesToDelete);
  // Delete the full lines
  for (var i = linesToDelete.length - 1; i >= 0; i--) {
    console.log("i = " + i);
    for (var j = this.squares.length - 1; j >= 0; j--) {
      console.log("j = " + j);
      var sprite = this.squares[j];
      console.log("sprite.y " + sprite.y);
      console.log("toDelete " + linesToDelete[i]);
      console.log("sqs " + block.squareSize);
      console.log("toDelete " + (linesToDelete[i]*block.squareSize));

      if (sprite.y == linesToDelete[i]*block.squareSize) {
        console.log("destroy " + y);
        this.squares.splice(j, 1);
        sprite.destroy();
      }
    };
  };
}
