function Board(w, h, darkStart){
    this.w = w;
    this.h = h;
    this.darkStart = typeof(darkStart)!='undefined' && darkStart ? 1 : 0;
    
    this.squareSize = 50;
    this.dot = 3;
    this.delt = 1;
}

Board.prototype.isValidPosition = function(pos){
    return pos.x >=0 && pos.x < this.w && pos.y >= 0 && pos.y < this.h;
}

Board.prototype.getSquarePosition = function(pos){
    return {left: pos.x*this.squareSize, top: pos.y*this.squareSize};
}

Board.prototype.width = function(){
    return this.w * this.squareSize;
}

Board.prototype.height = function(){
    return this.h * this.squareSize;
}

Board.prototype.setClick = function(callback){
    this.onClickPos = callback;
}

Board.prototype.init = function(){
    var self = this;
    this.container = $('<div />');
    this.container.css('position', 'absolute');
    this.container.css('border', '5px solid gray');
    this.container.width(this.squareSize * this.w);
    this.container.height(this.squareSize * this.h);
    this.container.css('visibility','hidden');

    this.squareArr = [];
    for(var x = 0; x < this.w; x++){
        this.squareArr[x] = [];
        for(var y = 0; y < this.h; y++){
            var square = this.squareArr[x][y] = $('<div />');
            square.css('position', 'absolute');
            square.css('width', this.squareSize);
            square.css('height', this.squareSize);
            square.css('left', x * this.squareSize);
            square.css('top', y * this.squareSize);
            square.appendTo(this.container);
            square.css('background', (x+y+this.darkStart)%2 ? 'lightgray' : 'white');
            square.attr('x', x);
            square.attr('y', y);
            square.click(function(){
                var $this = $(this);
                if(self.onClickPos){
                    self.onClickPos(P($this.attr('x'), $this.attr('y')));
                }
            });
        }
    }

    this.container.appendTo('body');
}

Board.prototype.ensureInited = function(){
    if(typeof(this.container) != 'undefined'){
        return;
    }
    this.init();
}

Board.prototype.show = function(x, y){
    this.ensureInited();
    this.x = x;
    this.y = y;
    this.container.css('left', this.x);
    this.container.css('top', this.y);
    this.container.css('visibility','visible');
}


Board.prototype.drawPixel = function(x, y, color, trans, w){
    this.ensureInited();
    var p = $('<div />');
    var dot = w ? w : this.dot;
    if(trans!=100){
        p.css('-moz-opacity', trans/100);
        p.css('opacity', trans/100);
        p.css('filter', 'alpha(opacity='+trans+')');
    }
    p.css('position', 'absolute');
    p.css('left', x-(dot-1)/2);
    p.css('top', y-(dot-1)/2);
    p.width(dot);
    p.height(dot);
    p.css('background', color);
    p.appendTo(this.container);
    return p;
}

Board.prototype.drawPixelLine = function(x1, y1, x2, y2, color, trans){
    var delt = this.delt;
    var o = {};
    var sx, sy, dx, dy;
    o.x1 = x1;
    o.y1 = y1;
    o.x2 = x2;
    o.y2 = y2;
    if(x1 == x2){
        sx = dx = x1;
        if(y1 < y2){
            sy = y1;
            dy = y2;
        }
        else{
            sy = y2;
            dy = y1;
        }
        for(var y = sy; y < dy; y+=delt){
            this.drawPixel(sx, y, color, trans);
        }
    }
    else if(y1 == y2){
        sy = dy = y1;
        if(x1 < x2){
            sx = x1;
            dx = x2;
        }
        else{
            sx = x2;
            dx = x1;
        }

        for(var x = sx; x < dx; x+=delt){
            this.drawPixel(x, sy, color, trans);
        }
    }
    else{
        if(x1 < x2){
            sx = x1;
            sy = y1;
            dx = x2;
            dy = y2;
        }
        else{
            sx = x2;
            sy = y2;
            dx = x1;
            dy = y1;
        }

        if(Math.abs(dx-sx) > Math.abs(dy-sy)){
            delt = delt * Math.abs(dx-sx) / Math.abs(dy-sy);
        }
        
        for(var x = sx; x < dx; x+=delt){
            this.drawPixel(x, sy+(x-sx)*(dy-sy)/(dx-sx), color, trans);
        }
    }

    var dot = this.dot;
    dot *= 3;
    this.drawPixel(x1, y1, color, trans, dot);
    this.drawPixel(x2, y2, color, trans, dot);
    return o;
}

Board.prototype.drawLine = function(pos1, pos2, color, trans){
    var square1 = this.getSquarePosition(pos1);
    var square2 = this.getSquarePosition(pos2);
    var sx = square1.left + this.squareSize / 2;
    var sy = square1.top + this.squareSize / 2;
    var dx = square2.left + this.squareSize / 2;
    var dy = square2.top + this.squareSize / 2;
    return this.drawPixelLine(sx, sy, dx, dy, color, trans);
}
