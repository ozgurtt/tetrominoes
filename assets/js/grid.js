// A Grid has a width, a height and stores the positions of the squares left
// from previously fallen blocks.
function Grid(w, h) {
  // 'lines' stores the sprites of the squares left from the blocks that have
  // previously fallen. lines[y][x] stores information about the square
  // positioned on line 'y' at column 'x', knowing that lines[0][0] is located
  // top-left.
  this.lines = [];
  this.w = w; // the number of squares that fit along the width of the grid
  this.h = h; // the number of squares that fit along the height of the grid
  this.fullLines = []; // the full lines that should be deleted after some delay

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
// and  only checks the lines on which this Block has squares. It returns an
// Array containing the y-coordinates of the deleted lines.
Grid.prototype.handleFullLines = function(block) {
  var slideDownRate = 1;
  var linesToCheck = [];
  var linesToDelete = [];
  var lowestLine = 0; // y coordinate of the lowest deleted line
  var highestLine = this.h - 1; // y coordinate of the highest deleted line
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
      lowestLine = Math.max(lowestLine,linesToCheck[i]);
    };
  };
  // Delete full lines.
  for (var i = linesToDelete.length - 1; i >= 0; i--) {
    this.removeAllFromLine(linesToDelete[i]);
  };
  // console.log('linesTD: ' + linesToDelete.length);
  // Slide down blocks which are above the deleted line.
  if (linesToDelete.length > 0) {
    for (var i = lowestLine-1; i >= 0; i--) { // i refers to the y coordinate (the line).
      // console.log('line: ' + i);
      if(slideDownRate < linesToDelete.length) { // Amongst the lines that are to be processed, one or more might just have been deleted.
        if(linesToDelete.indexOf(i) >= 0) { // The line with coordinate 'i' has just been deleted.
          slideDownRate += 1; // The code records that the lines above will have to be slided down one unit more.
          console.log('slideDownRate' + slideDownRate);
          continue; // Since line with y-coordinate 'i' has just been removed, no square on it have to be slided down, so the process should go to the next line.
        };
      };
      console.log('slideDown line ' + i + ' ' + slideDownRate + 'squares down.');
      for (var j = this.w - 1; j >= 0; j--) { // j refers to the x coordinate (the column).
        if ( this.lines[i].elts[j] != undefined) {
                //   var newY = i + linesToDelete.length;
                //   this.addToLine(newY,j,this.lines[i].elts[j]);
                //   this.lines[newY].elts[j].y += linesToDelete.length*block.squareSize;          
          this.slideDownSquare(i,j,slideDownRate,block.squareSize);
        };
      };
    };
    // for (var i = highestLine-1; i >= 0; i--) { // i refers to the y coordinate (the line).
    //   // console.log('line: ' + i);
    //   for (var j = this.w - 1; j >= 0; j--) { // j refers to the x coordinate (the column).
    //     if ( this.lines[i].elts[j] != undefined) {
    //             //   var newY = i + linesToDelete.length;
    //             //   this.addToLine(newY,j,this.lines[i].elts[j]);
    //             //   this.lines[newY].elts[j].y += linesToDelete.length*block.squareSize;          
    //       this.slideDownSquare(i,j,linesToDelete.length,block.squareSize);
    //     };
    //   };
    // }
  };
  this.printGrid();
  return linesToDelete;
}

