function MultiPath(){
    this.pathArr = [];
}

MultiPath.prototype.push = function(path){
    this.pathArr.push(path);
}

MultiPath.prototype.pushMultiPath = function(multiPath){
    var self = this;
    multiPath.each(function(path){
        self.push(path);
        return true;
    });
}

MultiPath.prototype.getLength = function(){
    return this.pathArr.length;
}

MultiPath.prototype.getPath = function(i){
    return this.pathArr[i];
}

MultiPath.prototype.each = function(callback){
    for(var i = 0; i < this.getLength(); i++){
        var ret = callback(this.getPath(i));
        if(typeof(ret)!='undefined' && !ret){
            break;
        }
    }
}

MultiPath.prototype.move = function(dir){
    this.each(function(path){
        path.move(dir);
    });
}

MultiPath.prototype.flipX = function(){
    var self = this;
    this.each(function(path){
        path.flipX(self.board);
    });
}

MultiPath.prototype.flipY = function(){
    var self = this;
    this.each(function(path){
        path.flipY(self.board);
    });
}

MultiPath.prototype.rotate = function(angle){
    var self = this;
    this.each(function(path){
        path.rotate(angle);
    });
}

MultiPath.prototype.rotate90 = function(){
    this.rotate(90);
}

MultiPath.prototype.rotate180 = function(){
    this.rotate(180);
}

MultiPath.prototype.rotate270 = function(){
    this.rotate(270);
}

MultiPath.prototype.clone = function(){
    var clone = new MultiPath();
    this.each(function(path){
        clone.push(path.clone());
    });
    return clone;
}

MultiPath.prototype.bind = function(board){
    this.b = board;
    this.each(function(path){
        path.bind(board);
    });
}

MultiPath.prototype.toString = function(){
    var string = '';
    this.each(function(path){
        string += path.toString() + '<br>';
    });
    return string;
}

MultiPath.prototype.show = function(colorArr, trans){
    trans = trans || 100;
    var colorIndex = 0;
    this.each(function(path){
        colorIndex = colorIndex % colorArr.length;
        path.show(colorArr[colorIndex], trans);
        colorIndex++;
    });
}

MultiPath.prototype.animateStep = function(){
    var self = this;
    var colorIndex = this.animatePathIndex % this.animateColorArr.length;
    var color = this.animateColorArr[colorIndex];
    this.k.walkPath({
        path:this.getPath(this.animatePathIndex),
        color: color,
        complete: function(){
            self.animatePathIndex++;
            if(self.animatePathIndex < self.getLength()){
                self.animateStep();
            }
            else{
                self.animateComplete();
            }
        }
    });
}

MultiPath.prototype.animate = function(colorArr, complete){
    this.k = new Knight();
    this.k.bind(this.b);
    this.animatePathIndex = 0;
    this.animateColorArr = colorArr;
    this.animateComplete = complete ? complete : function(){};
    this.animateStep();
}
