(function () {
  if (typeof Hanoi === "undefined") {
    window.Hanoi = {};
  }

  var View = Hanoi.View = function (game, $el) {
    this.game = game
    this.$el = $el
  };

  View.prototype.setupTowers = function() {

    this.$el.append("<ul class=\"all-towers\"></ul>");
    var $ul = this.$el.find("ul");
    for ( var i = 0; i < 3; i++) {
      $ul.append("<li data-tower=\"" + i + "\" class=\"tower\"><ul class=\"tower-list\"></ul></li>");
    }
    var $tower = this.$el.find(".tower-list");
    for (var i = 1; i < 4; i++) {
      $tower.append("<li class=\"disk invisible size" + i + "\"</li>");
    }
  };

  View.prototype.render = function() {
    var towers = this.game.towers;
    var $viewTowers = this.$el.find(".tower-list");

    for (var i = 0 ; i < 3 ; i++) {
      var tower = towers[i];
      var $viewTower = $($viewTowers[i]);
      var $children = $viewTower.children();

      for ( var j = 0 ; j < 3 ; j++) {
        if (tower.indexOf(j + 1) === -1) {
          $($children[j]).addClass("invisible");
        } else {
          $($children[j]).removeClass("invisible");
        }
      }
    }
  };

  View.prototype.clickTowers = function() {
    var prevClickTower = null;
    var result ;
    this.$el.on("click",".tower", function($tower) {
      var clickTower = $($tower.currentTarget).data("tower");
      if(prevClickTower !== null ){
        result = this.game.move(prevClickTower, clickTower);
        prevClickTower = null;
      } else {
        prevClickTower = clickTower;
        return;
      }
      if (result) {
        this.render();
        if (this.game.isWon()) {
          alert("CONGRATULATIONS");
        }
        result = null;
      } else {
        alert("invalid move");
      }
    }.bind(this));
  };


})();
