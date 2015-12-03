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
    this.board.snake.turn(View.KEYS[event.keyCode]);
  } else {

  }
};

View.prototype.render = function () {
  this.updateClasses(this.board.snake.segments, "snake");
  this.updateClasses([this.board.apple.position], "apple");

  $('.score').text("SCORE: " + this.board.snake.score);
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
    this.gameOver();
  }
};

View.prototype.gameOver = function () {
  window.clearInterval(this.intervalId);
  this.board.snake.score = 0;
  $(document).off('keydown');
  this.$el.append("<strong>Game Over</strong><strong><p>Click to Play Again</p></strong>");
  this.$el.one('click', function () {
    this.$el.empty();
    this.board = new Board(20);
    this.setupGrid();
    new SnakeGame.View($(".snake-game"));
  }.bind(this));
};

module.exports = View;
