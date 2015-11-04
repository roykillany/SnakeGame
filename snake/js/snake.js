(function (){
  var SnakeGame = window.SnakeGame || {}
  var Snake = SnakeGame.Snake

  Snake = function () {
    this.dir = "S"; // , "E", "S", "W"]
    this.segments = [0,0];
  }

  Snake.DIRECTIONS = ["N", "E", "S", "W"];
  Snake.COORD_DIRS = [[-1,0],[0,1], [1,0],[0 -1]]

  Snake.prototype.move = function () {
    this.segments.unshift(this.nextMove());
    this.segments.pop();

  }



  Snake.prototype.turn = function (direction) {
    if(isOpposite(this.dir, direction)){
    } else {
      this.dir = direction;
    }
  };

  SnakeGame.Coord = function () {

  }

  var isOpposite = function(snakeDir, newDir) {
    var first = Snake.DIRECTIONS.indexOf(snakeDir);
    var second = Snake.DIRECTIONS.indexOf(newDir);

    if (+(first - second) === 2) {
      return true;
    } else {
      return false;
    }
  };

  Snake.prototype.nextMove = function() {
    var coordDir = Snake.COORD_DIRS[Snake.DIRECTIONS.indexOf(this.dir)];
    var currentCoord = this.segments[0];
    var newCoord = [currentCoord[0] + coordDir[0],
                    currentCoord[1] + coordDir[1]];
    return newCoord;
  };

})();
