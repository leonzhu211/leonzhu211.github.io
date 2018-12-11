function _PageSource(obj){
    return function(){
        this.obj = obj;
        this.b = { width: function(){return 400;}};
        this.flagShow = false;
        this.data = null;
        this.x = 0;
        this.y = 0;
        
        this.init = function(){
            var self = this;
            $.ajax({url:self.obj+".js",complete:function(data){
                self.data = data.responseText;
                self.tryShow();
            }});
        }
        
        this.tryShow = function(){
            if(!this.data){
                return;
            }
            if(!this.flagShow){
                return;
            }
            this.container = $('<div />');
            this.container.css('position', 'absolute');
            this.container.css('left', this.x);
            this.container.css('top', this.y);
            this.container.css('padding-bottom', 20);
            this.container.appendTo('body');
    
            this.pre = $('<pre />');
            this.pre.appendTo(this.container);        
            this.pre.text(this.data);
            this.pre.snippet("javascript",{style:"typical",transparent:true,showNum:true});
        }
        
        this.show = function(x, y){
            this.x = x;
            this.y = y;
            this.flagShow = true;
            this.tryShow();
        }
        
        this.init();
    }
}


function _PageAnimateWrapper(page){
    return function(){
        this.page = new page();
        this.b = this.page.b;
        this.multiPath = this.page.multiPath;
        this.colorArr = this.page.colorArr;
        
        this.init = function(){
            var self = this;
            this.button = $("<INPUT type='button' value='animate' />")
            .css('position', 'absolute')
            .css('text-align', 'center')
            .css('visibility', 'hidden')
            .appendTo('body')
            .click(function(){
                self.multiPath.animate(self.colorArr);
                this.disabled = true;
            });
        }
        
        this.show = function(x, y){
            this.b.show(x, y);
            this.button.css('left', x + this.b.width()/2 - this.button.width()/2).css('top', y + this.b.height() + this.b.squareSize/2)
            .css('visibility', 'visible');
        }
        
        this.init();
    }
}

function _PageTransformWrapper(page, transform){
    return function(){
        this.page = new page();
        this.b = this.page.b;
        this.multiPath = this.page.multiPath;
        this.colorArr = this.page.colorArr;
        
        this.init = function(){
            this.multiPath[transform]();
        }
        
        this.show = function(x, y){
            this.b.show(x, y);
            this.multiPath.show(this.colorArr);
        }
        
        this.init();
    }
}

function _PageStartWrapper(page, pos){
    return function(){
        this.page = new page();
        this.b = this.page.b;
        this.multiPath = this.page.multiPath;
        this.colorArr = this.page.colorArr;
        
        this.init = function(){
            var path = this.multiPath.getPath(0);
            var pathNew = path.getClockWizeLine(pos);
            pathNew.turnToCycle();
            
            this.multiPath = new MultiPath();
            this.multiPath.push(pathNew);
            this.multiPath.bind(this.b);
        }
        
        this.show = function(x, y){
            this.b.show(x, y);
            this.multiPath.show(this.colorArr);
        }
        
        this.init();
    }
}


function _PageAnywhereWrapper(page){
    return function(){
        this.page = new page();
        this.b = this.page.b;
        this.multiPath = this.page.multiPath;
        this.colorArr = this.page.colorArr;
        
        this.init = function(){
            var self = this;
            this.b.setClick(function(pos){
                var path = self.multiPath.getPath(0);
                var pathNew = path.getClockWizeLine(pos);
                pathNew.turnToCycle();
                
                self.multiPath = new MultiPath();
                self.multiPath.push(pathNew);
                self.multiPath.bind(self.b);
                self.multiPath.animate(self.colorArr);
                self.b.setClick(null);
            });
        }
        
        this.show = function(x, y){
            this.b.show(x, y);
        }
        
        this.init();
    }
}

function _PageAllWrapper(page){
    var pageName = page.toString().match(/^function\s*([^\(]+).*/)[1];
    window[pageName+'Animate'] = _PageAnimateWrapper(page);
    //window[pageName+'Corner'] = _PageAnimateWrapper(_PageStartWrapper(page, P(0,0)));
    window[pageName+'Anywhere'] = _PageAnywhereWrapper(page);
    
    var transformArr = ['flipX', 'flipY', 'rotate90', 'rotate180', 'rotate270'];
    for(var i = 0; i < transformArr.length; i++){
        var transform = transformArr[i];
        var transformUpperCase = transform.substring(0,1).toUpperCase()+transform.substring(1)
        window[pageName+transformUpperCase] = _PageTransformWrapper(page, transform);
        window[pageName+transformUpperCase+'Animate'] =_PageAnimateWrapper(_PageTransformWrapper(page, transform));
        //window[pageName+transformUpperCase+'Corner'] = _PageAnimateWrapper(_PageStartWrapper(_PageTransformWrapper(page, transform), P(0,0)));
        window[pageName+transformUpperCase+'Anywhere'] = _PageAnywhereWrapper(_PageTransformWrapper(page, transform));
    }
}