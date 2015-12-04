var Coord = function (row, col) {
  this.row = row;
  this.col = col;
};

Coord.prototype.equals = function (coord) {
  // "this" is a coordinate that get compared to coord
  return (this.row == coord.row) && (this.col == coord.col);
};

Coord.prototype.isOpposite = function (coord) {
  return (this.row == (coord.row * -1)) && (this.col == (-1 * coord.col));
};

Coord.prototype.plus = function (coord) {
  return new Coord(this.row + coord.row, this.col + coord.col);
};

var Apple = function (board) {
  this.board = board;
  this.replace();
};

Apple.prototype.replace = function () {
  var x = Math.floor(Math.random() * this.board.dim);
  var y = Math.floor(Math.random() * this.board.dim);

  while (this.board.snake.isOccupying([x, y]) && this.board.bomb.isOccupying([x, y])) {
    x = Math.floor(Math.random() * this.board.dim);
    y = Math.floor(Math.random() * this.board.dim);
  }

  this.position = new Coord(x, y);
};

Apple.prototype.isOccupying = function (array) {
  var result = false;
    if (this.position.row === array[0] && this.position.col === array[1]) {
      result = true;
      return result;
    }
  return result;
};

var Bomb = function (board) {
  this.board = board;
  this.replace();
};

Bomb.prototype.replace = function () {
  var x = Math.floor(Math.random() * this.board.dim);
  var y = Math.floor(Math.random() * this.board.dim);

  while (this.board.snake.isOccupying([x, y]) && this.board.apple.isOccupying([x, y])) {
    x = Math.floor(Math.random() * this.board.dim);
    y = Math.floor(Math.random() * this.board.dim);
  }

  this.position = new Coord(x, y);
};

Bomb.prototype.isOccupying = function (array) {
  var result = false;
    if (this.position.row === array[0] && this.position.col === array[1]) {
      result = true;
      return result;
    }
  return result;
};

  var Snake = function (board) {
    this.dir = "S"; // , "E", "S", "W"]
    this.turning = false;
    this.board = board;

    var topCenter = new Coord(0, Math.floor(board.dim/2));
    this.segments = [topCenter];

    this.growTurns = 0;

    this.score = 0;

    this.hearts = [true, true, true];

    this.applesEaten = 0;
  };

  Snake.DIRECTIONS = {
    "N": new Coord(-1, 0),
    "E": new Coord( 0, 1),
    "S": new Coord( 1, 0),
    "W": new Coord( 0, -1)
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIRECTIONS[this.dir]));
    this.turning = false;

    if (this.eatApple()) {
      this.board.apple.replace();
      this.board.newBomb(this.applesEaten);
    }

    if (this.eatBomb()) {

    }

    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }

    if (!this.isValid()) {
      this.segments = [];
    }

    if (!this.hearts[0]) {
      this.segments = [];
    }
  };



  Snake.prototype.turn = function (direction) {
    if (Snake.DIRECTIONS[this.dir].isOpposite(Snake.DIRECTIONS[direction]) ||
      this.turning) {
      return;
    } else {
      this.dir = direction;
      this.turning = true;
    }
  };

Snake.prototype.isOccupying = function (array) {
  var result = false;
  this.segments.forEach(function (segment) {
    if (segment.row === array[0] && segment.col === array[1]) {
      result = true;
      return result;
    }
  });
  return result;
};

Snake.prototype.head = function () {
  return this.segments[this.segments.length - 1];
};

Snake.prototype.isValid = function () {
  var head = this.head();

  if (!this.board.offBoard(this.head())) {
    newCoord = this.board.getNewCoord(this.head());
    this.segments.pop();
    this.segments.push(new Coord(newCoord[0], newCoord[1]));
  }

  for (var i = 0; i < this.segments.length - 1; i++) {
    if (this.segments[i].equals(head)) {
      return false;
    }
  }

  return true;
};

Snake.prototype.eatApple = function () {
  if (this.head().equals(this.board.apple.position)) {
    this.growTurns += 1;
    this.score += 5;
    this.applesEaten += 1;
    return true;
  } else {
    return false;
  }
};

Snake.prototype.eatBomb = function () {
  var cond;
  if (this.head().equals(this.board.bomb.position)) {
    for (var i = 2; i >= 0; i--){
      if(this.hearts[i]){
        this.hearts[i] = false;
        i = -1;
      }
    }
    this.score -= 5;
    this.board.bomb.replace();

  } else if (this.applesEaten > 0) {

    for ( var j = 0; j < this.board.extraBombs.length; j++) {
      if (this.head().equals(this.board.extraBombs[j].position)) {
        for ( var x = 2; x >= 0; x--){
          if(this.hearts[x]){
            this.hearts[x] = false;
            x = -1;
          }
        }
        this.score -= 5;
        this.board.extraBombs.delete_at(j);
      }
    }
  }
  if (cond === undefined) {
    cond = false;
  }

  return cond;
};

  var Board = function (dimension) {
    this.dim = dimension;

    this.snake = new Snake(this);
    this.apple = new Apple(this);
    this.bomb = new Bomb(this);
    this.extraBombs = [];
  };

  Board.BLANK = ".";

  Board.blankGrid = function (dimension) {
    var grid = {};

    for ( var i = 0 ; i < dimension ; i++) {
      var row = [];
      for ( var j = 0 ; j < dimension ; j++) {
        row.push(Board.BLANK);
      }
      grid.push(row);
    }

    return grid;
  };


  Board.prototype.offBoard = function (coord) {
  return (coord.row >= 0) && (coord.row < this.dim) &&
    (coord.col >= 0) && (coord.col < this.dim);
  };

  Board.prototype.getNewCoord = function (coord) {

    newCoord = [];
    if (coord.row <= 0) {
      newCoord.push(this.dim);
    } else if (coord.row >= this.dim) {
      newCoord.push(0);
    } else {
      newCoord.push(coord.row);
    }

    if (coord.col <= 0) {
      newCoord.push(this.dim);
    }	else if (coord.col >= this.dim) {
      newCoord.push(0);
    } else {
      newCoord.push(coord.col);
    }
    return newCoord;
  };

  Board.prototype.newBomb = function () {
    this.extraBombs.push(new Bomb(this));
  };

  module.exports = Board;
