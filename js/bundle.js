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
	  event.preventDefault();
	  if (View.KEYS[event.keyCode]) {

	    if (event.keyCode == 38) {
	      $(".top").addClass("pressed-top");
	      window.setTimeout(function () {
	        $(".top").removeClass("pressed-top");
	      }, 400);
	    } else if (event.keyCode == 39) {
	      $(".right").addClass("pressed-right");
	      window.setTimeout(function () {
	        $(".right").removeClass("pressed-right");
	      }, 400);
	    } else if (event.keyCode == 40) {
	      $(".bottom").addClass("pressed-bottom");
	      window.setTimeout(function () {
	        $(".bottom").removeClass("pressed-bottom");
	      }, 400);
	    } else if (event.keyCode == 37) {
	      $(".left").addClass("pressed-left");
	      window.setTimeout(function () {
	        $(".left").removeClass("pressed-left");
	      }, 400);
	    }

	    this.board.snake.turn(View.KEYS[event.keyCode]);
	  } else {

	  }
	};

	View.prototype.render = function () {
	  this.updateClasses(this.board.snake.segments, "snake");
	  this.updateClasses([this.board.apple.position], "apple");
	  this.updateClasses([this.board.bomb.position], "bomb");

	  if ( this.board.snake.applesEaten > 0) {
	    for (var i = 0; i < this.board.extraBombs.length; i++) {
	      this.updateBombs([this.board.extraBombs[i].position], "bomb");
	    }
	  }

	  $('.score').text("SCORE: " + this.board.snake.score);
	  this.updateHearts(this.board.snake.hearts, "hearts");
	};

	View.prototype.updateClasses = function(coords, className) {
	  this.$li.filter("." + className).removeClass();

	  coords.forEach(function(coord){
	    var newCoord;
	    if (coord.col === 20) {
	     newCoord = ((coord.row * this.board.dim) + coord.col) - 1;
	    } else {
	     newCoord = (coord.row * this.board.dim) + coord.col;
	    }
	    this.$li.eq(newCoord).addClass(className);
	  }.bind(this));
	};

	View.prototype.updateBombs = function(coords, className) {
	  coords.forEach(function(coord){
	    var newCoord = (coord.row * this.board.dim) + coord.col;
	    this.$li.eq(newCoord).addClass(className);
	  }.bind(this));
	};

	View.prototype.updateHearts = function(hearts, className) {
	  $(".hearts").children("div").remove();

	  hearts.forEach( function (heart) {
	    if (heart) {
	      $("." + className).append("<div class='full'></div>");
	    } else {
	      $("." + className).append("<div class='empty'></div>");
	    }
	  });
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
	    this.gameOver();
	  }
	};

	View.prototype.gameOver = function () {
	  window.clearInterval(this.intervalId);
	  this.board.snake.score = 0;
	  $(document).off('keydown');
	  this.$el.append("<div class='game-over'><strong>Game Over</strong><strong class='play-again'><p>Click to Play Again</p></strong><div>");
	  this.$el.one('click', function () {
	    this.$el.empty();
	    this.board = new Board(20);
	    this.setupGrid();
	    new SnakeGame.View($(".snake-game"));
	  }.bind(this));
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

	  if (this.board.bomb === undefined) {
			while (this.board.snake.isOccupying([x, y])) {
					x = Math.floor(Math.random() * this.board.dim);
					y = Math.floor(Math.random() * this.board.dim);
				}
		} else {
			while ((this.board.snake.isOccupying([x, y]) || this.board.bomb.isOccupying([x, y]) || this.board.isOccupyingExtraBombs([x, y]))) {
			    x = Math.floor(Math.random() * this.board.dim);
			    y = Math.floor(Math.random() * this.board.dim);
			  }
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
	        this.board.extraBombs.splice(j, 1);
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


	  Board.prototype.isOccupyingExtraBombs = function (array) {
	    var result = false;
	    this.extraBombs.forEach(function (bomb) {
	      if (bomb.position.row === array[0] && bomb.position.col === array[1]) {
	        result = true;
	        return result;
	      }
	    });
	    return result;
	  };

	  module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {



/***/ }
/******/ ]);
