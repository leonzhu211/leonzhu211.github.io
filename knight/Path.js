function Path(){
    this.posArr = [];
}

Path.prototype.push = function(pos){
    this.posArr.push(pos.clone());
}

Path.prototype.getLength = function(){
    return this.posArr.length;
}

Path.prototype.getPos = function(i){
    return this.posArr[i];
}

Path.prototype.getFirst = function(){
    return this.getPos(0);
}

Path.prototype.getLast = function(){
    return this.getPos(this.getLength()-1);
}

Path.prototype.bind = function(board){
    this.board = board;
}

Path.prototype.hasBind = function(){
    return typeof(this.board)!='undefined';
}

Path.prototype.each = function(callback){
    for(var i = 0; i < this.posArr.length; i++){
        var ret = callback(this.getPos(i));
        if(typeof(ret)!='undefined' && !ret){
            break;
        }
    }
}

Path.prototype.eachReverse = function(callback){
    for(var i = this.posArr.length - 1; i >= 0; i--){
        var ret = callback(this.getPos(i));
        if(typeof(ret)!='undefined' && !ret){
            break;
        }
    }
}

Path.prototype.reverse = function(){
    var path = new Path();
    this.eachReverse(function(pos){
        path.push(pos);
    });
    return path;
}

Path.prototype.pushPath = function(you){
    var self = this;
    you.each(function(pos){
        self.push(pos);
    });
}

Path.prototype.toString = function(){
    var string = '';
    this.each(function(pos){
        if(string != ''){
            string += '-&gt;';
        }
        string += pos.toString();
    });
    return string;
}

Path.prototype.show = function(color, trans){
    trans = trans || 100;
    if(!this.hasBind()){
        error('path show but not bind');
        return;
    }
    var self = this;
    var prevPos = null;
    this.each(function(pos){
        if(prevPos != null){
            self.board.drawLine(prevPos, pos, color, trans);
        }
        prevPos = pos;
    });
}

Path.prototype.move = function(dir){
    this.each(function(pos){
        pos.move(dir);
    });
}

Path.prototype.flipX = function(){
    var self = this;
    this.each(function(pos){
        pos.flipX(self.board);
    });
}

Path.prototype.flipY = function(){
    var self = this;
    this.each(function(pos){
        pos.flipY(self.board);
    });
}

Path.prototype.rotate = function(angle){
    var self = this;
    this.each(function(pos){
        pos.rotate(self.board, angle);
    });
}

Path.prototype.clone = function(){
    var clone = new Path();
    this.each(function(pos){
        clone.push(pos);
    });
    return clone;
}

Path.prototype.hasPos = function(pos){
    var result = false;
    var comparePos = pos;
    this.each(function(pos){
        if(comparePos.equal(pos)){
            result = true;
            return false;
        }
    });
    return result;
}

Path.prototype.getPosIndex = function(pos){
    var posIndex = 0;
    var comparePos = pos;
    var flagFind = false;
    this.each(function(pos){
        if(comparePos.equal(pos)){
            flagFind = true;
            return false;
        }
        posIndex++;
    });
    return posIndex;
}

Path.prototype.isCycle = function(){
    return this.getFirst().equal(this.getLast());
}

Path.prototype.isLine = function(){
    return !this.isCycle();
}

Path.prototype.getNeighborIndexArr = function(posIndex){
    var neighborIndexArr = [];
    if(this.getLength() <= 1){
        return neighborIndexArr;
    }

    if(posIndex == 0){
        neighborIndexArr.push(1);
        if(this.isCycle()){
            neighborIndexArr.push(this.getLength()-2);
        }
    }
    else if(posIndex == this.getLength()-1){
        neighborIndexArr.push(this.getLength()-2);
        if(this.isCycle()){
            neighborIndexArr.push(1);
        }
    }
    else{
        neighborIndexArr.push(posIndex-1);
        neighborIndexArr.push(posIndex+1);
    }
    return neighborIndexArr;
}

Path.prototype.getCyclePathFromTo = function(fromIndex, toIndex){
    var path = new Path();
    if(fromIndex == toIndex - 1){
        for(var i = fromIndex; i >= 0; i--){
            path.push(this.getPos(i));
        }
        for(var i = this.getLength() - 2; i >= toIndex; i--){
            path.push(this.getPos(i));
        }
    }
    else if(fromIndex == this.getLength()-2 && toIndex == 0){
        for(var i = fromIndex; i >= toIndex; i--){
            path.push(this.getPos(i));
        }
    }
    else if(fromIndex == toIndex + 1){
        for(var i = fromIndex; i < this.getLength(); i++){
            path.push(this.getPos(i));
        }
        for(var i = 1; i <= toIndex; i++){
            path.push(this.getPos(i));
        }
    }
    else if(fromIndex == 0 && toIndex == this.getLength() - 2){
        for(var i = fromIndex; i <= toIndex; i++){
            path.push(this.getPos(i));
        }
    }
    else{
        error('getCyclePosArrFromTo');
    }
    return path;
}

Path.prototype.mergeCycle = function(myEndPos, you , yourEndPos){
    var myEndIndex = this.getPosIndex(myEndPos);
    var yourEndIndex = you.getPosIndex(yourEndPos);
    var myNeighborIndexArr = this.getNeighborIndexArr(myEndIndex);
    var yourNeighborIndexArr = you.getNeighborIndexArr(yourEndIndex);
    for(var myIndex = 0; myIndex < myNeighborIndexArr.length; myIndex++){
        var myCandidate = myNeighborIndexArr[myIndex];
        for(var yourIndex = 0; yourIndex < yourNeighborIndexArr.length; yourIndex++){
            var yourCandidate = yourNeighborIndexArr[yourIndex];
            if(RULE.canJumpTo(this.getPos(myCandidate), you.getPos(yourCandidate))){
                var path = new Path();
                var myPath = this.getCyclePathFromTo(myEndIndex, myCandidate);
                var yourPath = you.getCyclePathFromTo(yourCandidate, yourEndIndex);
                path.pushPath(myPath);
                path.pushPath(yourPath);
                return path;
            }
        }
    }
    return null;
}

Path.prototype.mergeLine = function(you){
    var path = new Path();
    var myEndIndex;
    var yourEndIndex;

    if(RULE.canJumpTo(this.getFirst(), you.getFirst())){
        myEndIndex = this.getLength()-1;
        yourEndIndex = you.getLength()-1;
    }
    else if(RULE.canJumpTo(this.getFirst(), you.getLast())){
        myEndIndex = this.getLength()-1;
        yourEndIndex = 0;
    }
    else if(RULE.canJumpTo(this.getLast(), you.getLast())){
        myEndIndex = 0;
        yourEndIndex = 0;
    }
    else if(RULE.canJumpTo(this.getLast(), you.getFirst())){
        myEndIndex = 0;
        yourEndIndex = you.getLength()-1;
    }

    if(myEndIndex == 0){
        path.pushPath(this);
    }
    else if(myEndIndex == this.getLength() - 1){
        path.pushPath(this.reverse());
    }
    else{
        error('myEndIndex:'+myEndIndex);
    }

    if(yourEndIndex == 0){
        path.pushPath(you.reverse());
    }
    else if(yourEndIndex == you.getLength() - 1){
        path.pushPath(you);
    }
    else{
        error('yourEndIndex:'+yourEndIndex);
    }

    return path;
}

Path.prototype.turnToCycle = function(){
    if(RULE.canJumpTo(this.getFirst(), this.getLast())){
        this.push(this.getFirst());
    }
    else{
        error("turnToCycle:" + this.toString());
    }
}

Path.prototype.getClockWizeLine = function(pos){
    var path = new Path();
    if(!this.hasPos(pos)){
        return path;
    }
    
    if(!this.isCycle()){
        return path;
    }
    
    var fromIndex = this.getPosIndex(pos);

    for(var i = fromIndex; i < this.getLength()-1; i++){
        path.push(this.getPos(i));
    }
    
    for(var i = 0; i < fromIndex; i++){
        path.push(this.getPos(i));
    }
    
    return path;
}

Path.prototype.getAntiClockWizeLine = function(pos){
    var path = new Path();
    if(!this.hasPos(pos)){
        return path;
    }
    
    if(!this.isCycle()){
        return path;
    }
    
    var fromIndex = this.getPosIndex(pos);

    for(var i = fromIndex; i > 0; i--){
        path.push(this.getPos(i));
    }
    
    for(var i = this.getLength()-1; i > fromIndex; i--){
        path.push(this.getPos(i));
    }
    
    return path;
}

Path.prototype.getJointPos = function(outPos){
    var jointPos = null;
    this.each(function(pos){
        if(RULE.canJumpTo(outPos, pos)){
            jointPos = pos.clone();
            return false;
        }
    });
    return jointPos;
}

Path.prototype.getJointPosReverse = function(outPos){
    var jointPos = null;
    this.eachReverse(function(pos){
        if(RULE.canJumpTo(outPos, pos)){
            jointPos = pos.clone();
            return false;
        }
    });
    return jointPos;
}