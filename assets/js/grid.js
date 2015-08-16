// A Grid is defined by its width, its height and the positions of the
// squares left from former blocks.
function Grid(w, h) {
  // // squares stores the coordinates of the squares from former blocks still
  // // visible in the grid.
  // this.squares = [];

  // 'squares' stores the sprites of the squares from former blocks still
  // visible in the grid.
  this.squares = [];
  this.lines = [];
  this.w = w;
  this.h = h;

  // Private constructor which sets up the lines.
  var __construct = function(that) {
    for (var i = that.h - 1; i >= 0; i--) {
      that.lines[i] = {breadth: 0, elts : []};
    };
  }(this);
};

Grid.prototype.addToLine = function(i,j,square) {
  if (this.lines[i].elts[j] == undefined){
    this.lines[i].elts[j] = square;
    this.lines[i].breadth += 1;
  }
};

Grid.prototype.removeFromLine = function(i,j) {
  if (this.lines[i].elts[j] != undefined){
    console.log(this.lines[i].elts[j]);
    this.lines[i].elts[j].destroy();
    this.lines[i].elts[j] = undefined;
    this.lines[i].breadth -= 1;

  }
};

Grid.prototype.removeAllFromLine = function(line) {
  console.log("rAFL " + line);
  for (var j = this.w; j >= 0; j--) {
    this.removeFromLine(line,j);
  }
};  

Grid.prototype.slideDownSquare = function(i,j,distance,squareSize) {
  if (this.lines[i+distance].elts[j] == undefined){
    this.lines[i+distance].elts[j] = this.lines[i].elts[j];
    this.lines[i+distance].breadth += 1;
    this.lines[i+distance].elts[j].y += distance*squareSize; 
    // this.lines[i].elts[j].destroy();
    this.lines[i].breadth -= 1;
    this.lines[i].elts[j] = undefined;
  }
};

Grid.prototype.printGrid = function() {
  console.log('Grid:');
  for (var i = 0; i < this.h; i++) {
  var lines = '';
    for (var j = 0; j < this.w ; j++) {
      if (this.lines[i].elts[j] != undefined) {
        lines += '1';
      } else lines += '0';
    };
    console.log(lines);
  };
}



// Grid.handleFullLines(block) checks if there are lines completelly filled
// with squares and erases them if they exist. It takes as an argument a Block
// and  only checks the lines on which this Block has squares. It returns the
// number of lines deleted.
Grid.prototype.handleFullLines = function(block) {
  var linesToCheck = [];
  var linesToDelete = [];
  var highestLine = this.h - 1; // Smaller y coordinate
  // Find the y coordinates of the lines where 'block' has a square and
  // store them in 'linesToCheck'.
  for (var i = block.squaresInGrid.length - 1; i >= 0; i--) {
    var y = block.squaresInGrid[i].y;
    if (linesToCheck.indexOf(y) < 0) {
      linesToCheck.push(y);
    };
  };
  // Find out which lines are completely filled with squares and store their
  // y-coordinates in 'linesToDelete'. Store also the y-coordinate of the
  // highest line to be deleted.
  for (var i = linesToCheck.length - 1; i >= 0; i--) {
    if(this.lines[linesToCheck[i]].breadth == this.w) {
      linesToDelete.push(linesToCheck[i]);
      highestLine = Math.min(highestLine,linesToCheck[i]);
    }; 
  } 
  // Delete full lines.
  for (var i = linesToDelete.length - 1; i >= 0; i--) {
    this.removeAllFromLine(linesToDelete[i]);
  }; 
  // console.log('linesTD: ' + linesToDelete.length);
  // Slide down blocks which are above the deleted line.
  if (linesToDelete.length > 0) {
    for (var i = highestLine-1; i >= 0; i--) { // i refers to the y coordinate (the line).
      // console.log('line: ' + i);
      for (var j = this.w - 1; j >= 0; j--) { // j refers to the x coordinate (the column).
        if ( this.lines[i].elts[j] != undefined) {
                //   var newY = i + linesToDelete.length;
                //   this.addToLine(newY,j,this.lines[i].elts[j]);
                //   this.lines[newY].elts[j].y += linesToDelete.length*block.squareSize;          
          this.slideDownSquare(i,j,linesToDelete.length,block.squareSize);
        };
      };
    }
  };
  this.printGrid();
}

