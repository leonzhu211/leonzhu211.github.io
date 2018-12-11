var PageCycleBase4x4 = PageBlockBase4x4;

function PageCycleSmallCycle16(){
    this.base = new PageCycleBase4x4();
    this.b = new Board(8, 8);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;
    this.clockArr = [P(0,0), P(1,0), P(1,1), P(0,1)];
    
    this.init = function(){
        for(var i = 0; i < this.clockArr.length; i++){
            var pos = this.clockArr[i];
            var multiPath = this.base.multiPath.clone();
            multiPath.bind(this.b);
            multiPath.move(D(pos.x*4, pos.y*4));
            this.multiPath.pushMultiPath(multiPath);
        }
        
        this.multiPath.bind(this.b);
    }
    
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

function PageCycleMediumCycle4(){
    this.base = new PageCycleSmallCycle16();
    this.b = new Board(8, 8);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;
    
    this.init = function(){
        this.startPosArr = [];
        for(var i = 0; i < 4; i++){
            this.startPosArr.push(P(i,3));
        }
        
        for(var i = 0; i < 4; i++){
            var path = new Path();
            var startPos = this.startPosArr[i];
            var currCycleIndex = 0;
            var currCyclePath = null;
            for(var cycleIndex = 0; cycleIndex < 4; cycleIndex++){
                var cyclePath = this.base.multiPath.getPath(cycleIndex);
                if(cyclePath.hasPos(startPos)){
                    currCycleIndex = cycleIndex;
                    currCyclePath = cyclePath;
                    break;
                }
            }
            
            if(currCyclePath == null){
                continue;
            }
            
            path.pushPath(currCyclePath.getClockWizeLine(startPos));
            
            for(var blockIndex = 1; blockIndex < 4; blockIndex++){
                var pathIndex = blockIndex * 4 + cycleIndex;
                var blockPath = this.base.multiPath.getPath(pathIndex);
                var jointPos = blockPath.getJointPos(path.getLast());
                path.pushPath(blockPath.getClockWizeLine(jointPos));
            }
            
            path.turnToCycle();
            this.multiPath.push(path);
        }
        
        this.multiPath.bind(this.b);
    }
    
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

function PageCycleBigCycle(){
    this.base = new PageCycleMediumCycle4();
    this.b = new Board(8, 8);
    this.multiPath = new MultiPath();
    this.colorArr = this.base.colorArr;
    
    this.cyclePathJointedArr = [false, false, false, false];
    this.pushPathIndex = 0;
    this.path = new Path();
    
    this.pushCyclePath = function(cyclePathIndex, startPos){
        var cyclePath = this.base.multiPath.getPath(cyclePathIndex);
        if(this.pushPathIndex % 2){
            this.path.pushPath(cyclePath.getAntiClockWizeLine(startPos));
        }
        else{
            this.path.pushPath(cyclePath.getClockWizeLine(startPos));
        }
        this.cyclePathJointedArr[cyclePathIndex] = true;
        this.pushPathIndex++;
    }
    
    this.isAllJointed = function(){
        var allJointed = true;
        for(var i = 0; i < this.cyclePathJointedArr.length; i++){
            if(!this.cyclePathJointedArr[i]){
                allJointed = false;
            }
        }
        
        return allJointed;
    }
    
    this.init = function(){
        var self = this;
        var startPos = this.base.startPosArr[3];
        
        for(var i = 0; i < this.base.multiPath.getLength(); i++){
            var cyclePath = this.base.multiPath.getPath(i);
            if(cyclePath.hasPos(startPos)){
                this.pushCyclePath(i, startPos);
            }
        }
        
        while(true){
            if(this.isAllJointed()){
                break;
            }
            
            RULE.eachNext(this.path.getLast(), function(pos){
                for(var i = 0; i < self.base.multiPath.getLength(); i++){
                    if(self.cyclePathJointedArr[i]){
                        continue;
                    }
                    var cyclePath = self.base.multiPath.getPath(i);
                    if(cyclePath.hasPos(pos)){
                        self.pushCyclePath(i, pos);
                        return false;
                    }
                }
            });
        }
        
        this.path.turnToCycle();
        this.multiPath.push(this.path);
        this.multiPath.bind(this.b);
    }
    
    this.show = function(x, y){
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }
    
    this.init();
}

_PageAllWrapper(PageCycleBigCycle);