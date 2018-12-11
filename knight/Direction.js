function Direction(dx, dy){
    this.dx = dx;
    this.dy = dy;
}

Direction.prototype.clone = function(){
    return new Direction(this.dx, this.dy);
}

Direction.prototype.reverse = function(){
    return new Direction(-this.dx, -this.dy);
}

function D(dx, dy){
    return new Direction(dx, dy);
}