(function () {
  if (typeof TTT === "undefined") {
    window.TTT = {};
  }

  var View = TTT.View = function (game, $el) {
    this.game = game;
    this.$el = $el;
  };

  View.prototype.bindEvents = function () {
    this.$el.on("click","li",this.makeMove.bind(this));
  };

  View.prototype.makeMove = function ($square) {
    var $li = $($square.currentTarget);
    if ($li.hasClass("checked")) {
      alert("Invalid Move!");
    } else {
    $li.addClass("checked " + this.game.currentPlayer);
    this.game.swapTurn();
    }
    // check for winner
    var grid = this.makeGrid();
    if(TTT.Board.prototype.winner.call(grid)){
      alert ("Congrats you won!")
    };
  };

  View.prototype.makeGrid = function () {
    var board = new TTT.Board;
    board.grid = [[],[],[]];
    var $squares = this.$el.find("li");
    for( var i = 0 ; i < 3 ; i++){
      for( var j = 0 ; j < 3; j++){
        var $sq = $($squares[3 * i + j]);
        if ($sq.hasClass("x")){
          board.grid[i][j] = "x";
        } else if ($sq.hasClass("o")){
          board.grid[i][j] = "o";
        } else {
          board.grid[i][j] = null;
        }
      }
    }
    return board;
  };

  View.prototype.setupBoard = function () {
    this.$el.append("<ul class=\"ttt-board\"></ul>");
    var $ul = this.$el.find("ul")
    for(var i = 0; i < 9; i++){
      $ul.append("<li class=\"ttt-space\"></li>");
    }

  };
})();
//
// $li.data("pos") // =>
//
// {0: [0, 0],
//  1: [0, 1]}
