var Board = require('./snake.js');

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
