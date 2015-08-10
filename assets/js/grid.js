// A Grid is defined by its width, its height and the positions of the
// squares left from former blocks.
function Grid (w, h) {
  // squares stores the coordinates of the squares from former blocks still 
  // visible in the grid.
  this.squares = []; 
  this.theWidth = w;
  this.theHeight = h;
}

// Grid.handleFullLines() checks if there are lines completelly filled with
// squares and erases them if they exist. It returns the number of lines
// erased.
Grid.prototype.handleFullLines = function () {
  
}
