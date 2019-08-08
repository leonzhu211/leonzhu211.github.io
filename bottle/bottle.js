function Bottle() {
    var self = this;

    window.onClickStart = function() {
        self.onClickStart();
    };
}


Bottle.prototype.onClickStart = function() {

}

$(document).ready(function() {
    new LifeGame();
});