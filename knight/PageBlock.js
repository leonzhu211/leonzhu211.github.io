function PageBlockBase4x4(){
    this.b = new Board(4, 4);
    this.k = new Knight();
    this.k.bind(this.b);

    this.multiPath = new MultiPath();

    this.startPosArr = [P(0,0), P(0,1), P(0,2), P(0,3)];
    this.colorArr = ['blue', 'green', 'red', 'black']

    this.getPath = function(posIndex){
        var path = new Path();
        var startPos = this.startPosArr[posIndex];
        var currentPos = startPos;
        path.push(currentPos);
        var dirIndex = 0;
        while(true){
            var pos = currentPos.next(RULE.getDir(dirIndex));
            if(this.b.isValidPosition(pos)){
                currentPos = pos;
                path.push(currentPos);
                if(currentPos.equal(startPos)){
                    break;
                }
            }
            dirIndex++;
            if(dirIndex == RULE.length){
                dirIndex = 0;
            }
        }
        path.bind(this.b);
        return path;
    }

    this.getAllPath = function(){
        for(var i = 0; i < this.startPosArr.length; i++){
            this.multiPath.push(this.getPath(i));
        }
    }

    this.init = function(){
        this.getAllPath();
        this.multiPath.bind(this.b);
    }

    this.showBoard = function(x, y){
        this.b.show(x, y);
    }

    this.show = function(x, y){
        this.showBoard(x,y);
        this.multiPath.show(this.colorArr);
    }

    this.animate = function(x, y){
        this.showBoard(x,y);
        this.multiPath.animate(this.colorArr);
    }

    this.init();
}

var PageBlockBase4x4Animate = _PageAnimateWrapper(PageBlockBase4x4);

function PageBlockDoubleCyleToLine(){
    this.b = new Board(4, 4);
    this.base = new PageBlockBase4x4();
    this.multiPath = new MultiPath();
    this.colorArr = [];

    this.init = function(){
        var multiPath = this.base.multiPath;
        for(var i = 0; i < multiPath.getLength(); i+=2){
            var p1 = multiPath.getPath(i);
            var p2 = multiPath.getPath(i+1);
            var path = p1.mergeCycle(P(0,i), p2, P(0,i+1));
            this.multiPath.push(path);
            this.colorArr.push(this.base.colorArr[i]);
        }
        this.multiPath.bind(this.b);
    }

    this.show = function(x, y){
        this.base.b.show(x, y);
        this.multiPath.bind(this.base.b);
        this.base.multiPath.getPath(0).show('red', 50);
        this.base.multiPath.getPath(1).show('blue', 50);
        this.multiPath.getPath(0).show('black', 100);
        return;
    }

    this.init();
}

function PageBlockDoubleLine4x4(){
    this.b = new Board(4, 4);
    this.base = new PageBlockBase4x4();
    this.multiPath = new MultiPath();
    this.colorArr = [];

    this.init = function(){
        var multiPath = this.base.multiPath;
        for(var i = 0; i < multiPath.getLength(); i+=2){
            var p1 = multiPath.getPath(i);
            var p2 = multiPath.getPath(i+1);
            var path = p1.mergeCycle(P(0,i), p2, P(0,i+1));
            this.multiPath.push(path);
            this.colorArr.push(this.base.colorArr[i]);
        }
        this.multiPath.bind(this.b);
    }

    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }

    this.init();
}

function PageBlockDoubleLine8x4FlipX(){
    this.base = new PageBlockDoubleLine4x4();
    this.b = new Board(8, 4);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;

    this.init = function(){
        var multiPath = this.base.multiPath;
        var multiPathLeft = multiPath.clone();
        var multiPathRight = multiPath.clone();

        multiPathLeft.bind(this.base.b)
        multiPathLeft.flipX();
        multiPathLeft.bind(this.b);

        multiPathRight.bind(this.b);
        multiPathRight.move(D(4, 0));

        this.multiPath.pushMultiPath(multiPathLeft);
        this.multiPath.pushMultiPath(multiPathRight);
    }

    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }

    this.init();
}

function PageBlockDoubleCycle8x4(){
    this.base = new PageBlockDoubleLine8x4FlipX();
    this.b = new Board(8, 4);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;
    
    this.init = function(){
        var multiPath = this.base.multiPath;
        this.multiPath.push(multiPath.getPath(0).mergeLine(multiPath.getPath(3)));
        this.multiPath.push(multiPath.getPath(1).mergeLine(multiPath.getPath(2)));
        this.multiPath.getPath(0).turnToCycle();
        this.multiPath.getPath(1).turnToCycle();
        this.multiPath.bind(this.b);
    }
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

function PageBlockSingleLine8x4Top(){
    this.base = new PageBlockDoubleCycle8x4();
    this.b = new Board(8, 4);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;
    
    this.init = function(){
        var multiPath = this.base.multiPath;
        var path0 = multiPath.getPath(0);
        var path1 = multiPath.getPath(1);
        var path = path0.mergeCycle(P(0,3), path1, P(1,3));
        this.multiPath.push(path);
        this.multiPath.bind(this.b);
    }
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

function PageBlockSingleLine8x4Bottom(){
    this.base = new PageBlockDoubleCycle8x4();
    this.b = new Board(8, 4);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;
    
    this.init = function(){
        var multiPath = this.base.multiPath;
        multiPath.flipY();
        var path0 = multiPath.getPath(0);
        var path1 = multiPath.getPath(1);
        var path = path0.mergeCycle(P(2,0), path1, P(3,0));
        this.multiPath.push(path);
        this.multiPath.bind(this.b);
    }
    
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

function PageBlockDoubleLine8x8(){
    this.baseTop = new PageBlockSingleLine8x4Top();
    this.baseBottom = new PageBlockSingleLine8x4Bottom();
    
    this.b = new Board(8, 8);
    this.multiPath = new MultiPath();
    this.colorArr = this.baseTop.colorArr;
    
    this.init = function(){
        var multiPathTop = this.baseTop.multiPath;
        var multiPathBottom = this.baseBottom.multiPath;
        multiPathTop.bind(this.b);
        multiPathBottom.bind(this.b);
        multiPathBottom.move(D(0,4));
        this.multiPath.pushMultiPath(multiPathTop);
        this.multiPath.pushMultiPath(multiPathBottom);
        this.multiPath.bind(this.b);
    }
    
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

function PageBlockSingleCycle8x8(){
    this.base = new PageBlockDoubleLine8x8();
    this.b = new Board(8, 8);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;
    
    this.init = function(){
        var multiPath = this.base.multiPath;
        var path0 = multiPath.getPath(0);
        var path1 = multiPath.getPath(1);
        var path = path0.mergeLine(path1);
        path.turnToCycle();
        
        this.multiPath.push(path);
        this.multiPath.bind(this.b);
    }
    
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

_PageAllWrapper(PageBlockSingleCycle8x8);