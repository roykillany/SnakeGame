/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(1);
	module.exports = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	window.SnakeGame = {};
	SnakeGame.View = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);

	var View = function ($el) {
	  this.$el = $el;

	  this.board = new Board(20);
	  this.setupGrid();

	  this.intervalId = window.setInterval(
	    this.step.bind(this),
	    100
	  );

	  $(window).on("keydown", this.handleKeyEvent.bind(this));
	};

	View.KEYS = {
	  38: "N",
	  39: "E",
	  40: "S",
	  37: "W"
	};

	View.prototype.handleKeyEvent = function (event) {
	  if (View.KEYS[event.keyCode]) {
	    this.board.snake.turn(View.KEYS[event.keyCode]);
	  } else {

	  }
	};

	View.prototype.render = function () {
	  this.updateClasses(this.board.snake.segments, "snake");
	  this.updateClasses([this.board.apple.position], "apple");
	};

	View.prototype.updateClasses = function(coords, className) {
	  this.$li.filter("." + className).removeClass();

	  coords.forEach(function(coord){
	    var newCoord = (coord.row * this.board.dim) + coord.col;
	    this.$li.eq(newCoord).addClass(className);
	  }.bind(this));
	};

	View.prototype.setupGrid = function () {
	  var html = "";

	  for (var i = 0; i < this.board.dim; i++) {
	    html += "<ul>";
	    for (var j = 0; j < this.board.dim; j++) {
	      html += "<li></li>";
	    }
	    html += "</ul>";
	  }

	  this.$el.html(html);
	  this.$li = this.$el.find("li");
	};

	View.prototype.step = function () {
	  if (this.board.snake.segments.length > 0) {
	    this.board.snake.move();
	    this.render();
	  } else {
	    alert("You lose!");
	    window.clearInterval(this.intervalId);
	  }
	};

	module.exports = View;


/***/ },
/* 3 */
/***/ function(module, exports) {

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

	  while (this.board.snake.isOccupying([x, y])) {
	    x = Math.floor(Math.random() * this.board.dim);
	    y = Math.floor(Math.random() * this.board.dim);
	  }

	  this.position = new Coord(x, y);
	};

	  var Snake = function (board) {
	    this.dir = "S"; // , "E", "S", "W"]
	    this.turning = false;
	    this.board = board;

	    var topCenter = new Coord(0, Math.floor(board.dim/2));
	    this.segments = [topCenter];

	    this.growTurns = 0;
	  };

	  Snake.DIRECTIONS = {
	    "N": new Coord(-1, 0),
	    "E": new Coord( 0, 1),
	    "S": new Coord( 1, 0),
	    "W": new Coord( 0, -1)
	  };

	  Snake.SYMBOL = "S";
	  Snake.GROW_TURNS = 1;
	  Apple.SYMBOL = "A";

	  Snake.prototype.move = function () {
	    this.segments.push(this.head().plus(Snake.DIRECTIONS[this.dir]));
	    this.turning = false;

	    if (this.eatApple()) {
	      this.board.apple.replace();
	    }

	    if (this.growTurns > 0) {
	      this.growTurns -= 1;
	    } else {
	      this.segments.shift();
	    }

	    if (!this.isValid()) {
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

	  if (!this.board.validPosition(this.head())) {
	    return false;
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
	    return true;
	  } else {
	    return false;
	  }
	};

	  var Board = function (dimension) {
	    this.dim = dimension;

	    this.snake = new Snake(this);
	    this.apple = new Apple(this);
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

	  Board.prototype.render = function () {
	    var grid = Board.blankGrid(this.dim);

	    this.snake.segments.forEach(function (segment) {
	      grid[segment.row][segment.col] = Snake.SYMBOL;
	    });

	    grid[this.apple.position.row][this.apple.position.col] = Apple.SYMBOL;

	    var rowStrs = [];
	    grid.map(function (row) {
	      return row.join("");
	    }).join("\n");
	  };

	  Board.prototype.validPosition = function (coord) {
	  return (coord.row >= 0) && (coord.row < this.dim) &&
	    (coord.col >= 0) && (coord.col < this.dim);
	  };

	  module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {

	

/***/ }
/******/ ]);