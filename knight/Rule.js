function Rule(){
    this.dirArr = [];
    this.dirArr.push(D(-2,-1));
    this.dirArr.push(D(-1,-2));
    this.dirArr.push(D(+1,-2));
    this.dirArr.push(D(+2,-1));
    this.dirArr.push(D(+2,+1));
    this.dirArr.push(D(+1,+2));
    this.dirArr.push(D(-1,+2));
    this.dirArr.push(D(-2,+1));

    this.length = this.dirArr.length;
}

Rule.prototype.getDir = function(i){
    return this.dirArr[i];
}

Rule.prototype.each = function(callback){
    for(var i = 0; i < this.length; i++){
        var dir = this.getDir(i);
        var ret = callback(dir);
        if(typeof(ret)!='undefined' && !ret){
            break;
        }
    }
}

Rule.prototype.eachNext = function(pos, callback){
    this.each(function(dir){
        return callback(pos.next(dir));
    });
}

Rule.prototype.canJumpTo = function(pos1, pos2){
    var canJumpTo = false;
    this.each(function(dir){
        if((pos1.x + dir.dx == pos2.x && pos1.y + dir.dy == pos2.y)
            ||(pos2.x + dir.dx == pos1.x && pos2.y + dir.dy == pos1.y)){
            canJumpTo = true;
            return false;
        }
    });
    return canJumpTo;
}

RULE = new Rule();
function DI(i){
    return RULE.getDir(i);
}