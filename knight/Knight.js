function Knight(){
    this.img = $("<img src='knight.png' />");
    this.img.css('position', 'absolute');
    this.img.css('z-index', 999);
    this.img.hide();
    this.img.appendTo('body');

    this.pauseTime = 300;
}

Knight.prototype.resize = function(size){
    this.img.css('width', size);
    this.img.css('height', size);
}

Knight.prototype.bind = function(board){
    this.board = board;
    this.resize(board.squareSize);
}

Knight.prototype.unbind = function(){
    this.board = 'undefined';
    this.img.remove();
}

Knight.prototype.hasBind = function(){
    return typeof(this.board)=='object';
}

Knight.prototype.setPause = function(t){
    this.pauseTime = t;
}

Knight.prototype.isValidDir = function(dir){
    if(!this.hasPos()){
        return false;
    }

    if(!this.hasBind()){
        return false;
    }

    return this.board.isValidPosition(this.pos.next(dir));
}

Knight.prototype.jumpDir = function(dir){
    if(!this.isValidDir(dir)){
        return false;
    }

    this.jumpTo(this.pos.next(dir));
}

Knight.prototype.jumpDirIndex = function(i){
    if(i < 0){
        i = 0;
    }
    if(i > RULE.length){
        i = RULE.length - 1;
    }
    return this.jumpDir(RULE.getDir(i));
}

Knight.prototype.hasPos = function(){
    return typeof(this.pos)=='object';
}

Knight.prototype.setPos = function(pos){
    this.pos = pos.clone();

    if(typeof(this.walkParam)!='undefined'
    && typeof(this.walkParam.callback)!='undefined'
    && this.walkParam.callback){
        var self = this;
        setTimeout(function(){
            self.walkParam.callback(pos)
        }, this.pauseTime);
    }
}

Knight.prototype.posAt = function(pos){
    var squarePos = this.board.getSquarePosition(pos);
    this.img.css('left', squarePos.left);
    this.img.css('top', squarePos.top);
    this.img.appendTo(this.board.container);
    this.img.show();
    this.setPos(pos);
}

Knight.prototype.animate = function(pos, complete){
    var squarePos = this.board.getSquarePosition(pos);
    this.img.animate({left:squarePos.left, top: squarePos.top}, {complete:complete});
    this.setPos(pos);
}

Knight.prototype.jumpTo = function(pos, stepOver, stepNext){
    var first = !this.hasPos();
    if(first){
        this.posAt(pos);
        if(typeof(stepOver)!='undefined'){
            stepOver();
        }
        if(typeof(stepNext)!='undefined'){
            setTimeout(stepNext, this.pauseTime);
        }
    }
    else{
        var self = this;
        this.animate(pos, function(){
            if(typeof(stepOver)!='undefined'){
                stepOver();
            }
            if(typeof(stepNext)!='undefined'){
                setTimeout(stepNext, self.pauseTime);
            }
        });
    }
}

Knight.prototype.walkNext = function(){
    var self = this;
    this.jumpTo(this.walkParam.getCurrentPos()
    , function(){
        self.walkParam.stepOver();
    }
    , function(){
        if(self.walkParam.hasNextPos()){
            self.walkParam.moveToNextPos();
            self.walkNext();
        }
        else{
            if(typeof(self.walkParam.complete)!='undefined' && self.walkParam.complete){
                self.walkParam.complete();
            }
        }
    });
}

Knight.prototype.walk = function(param){
    this.walkParam = param;
    if(typeof(this.walkParam.init)!='undefined'){
        this.walkParam.init();
    }
    this.walkNext();
}

Knight.prototype.walkPath = function(param){
    var self = this;
    return this.walk({
        path: param.path,
        callback: typeof(param.callback)!='undefined'?param.callback:null,
        complete: typeof(param.complete)!='undefined'?param.complete:null,
        color: typeof(param.color)!='undefined'?param.color:'blue',
        posIndex: 0,
        init: function(){
        },
        stepOver: function(){
            if(this.posIndex > 0){
                var pos1 = this.path.getPos(this.posIndex-1);
                var pos2 = this.path.getPos(this.posIndex);
                self.board.drawLine(pos1, pos2, this.color);
            }
        },
        getCurrentPos: function(){
            return this.path.getPos(this.posIndex);
        },
        moveToNextPos: function(){
            this.posIndex++;
        },
        hasNextPos: function(){
            return this.posIndex < this.path.getLength() - 1;
        }
    });
}

Knight.prototype.walkTemplate = function(param){
    var self = this;
    return this.walk({
        prop: param.prop,
        callback: typeof(param.callback)!='undefined'?param.callback:null,
        complete: typeof(param.complete)!='undefined'?param.complete:null,
        init: function(){
        },
        getCurrentPos: function(){
        },
        moveToNextPos: function(){
        },
        hasNextPos: function(){
        }
    });
}
