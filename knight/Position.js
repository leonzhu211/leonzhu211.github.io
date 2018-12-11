function Position(x, y){
    this.x = x;
    this.y = y;
}

Position.prototype.clone = function(){
    return new Position(this.x, this.y);
}

Position.prototype.next = function(dir){
    return new Position(this.x + dir.dx, this.y + dir.dy);
}

Position.prototype.equal = function(pos){
    return this.x == pos.x && this.y == pos.y;
}

Position.prototype.move = function(dir){
    this.x += dir.dx;
    this.y += dir.dy;
}

Position.prototype.flipX = function(board){
    this.x = board.w - 1 - this.x;
}

Position.prototype.flipY = function(board){
    this.y = board.h - 1 - this.y;
}

Position.prototype.rotate90 = function(board){
    var x = this.x;
    var y = this.y;
    this.x = board.w - 1 - y;
    this.y = x;
}

Position.prototype.rotate = function(board, angle){
    var count = parseInt(angle/90) % 4;
    for(var i = 0; i < count; i++){
        this.rotate90(board);
    }
}

Position.prototype.toString = function(){
    return "(" + this.x + "," + this.y + ")";
}

function P(x, y){
    return new Position(x, y);
}

