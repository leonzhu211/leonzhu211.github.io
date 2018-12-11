function Request(){
    var url=location.search;
    var r = new Object();
    if(url.indexOf("?")!=-1){
        var str = url.substr(1);
        var strs= str.split("&");
        for(var i= 0; i < strs.length; i++){
            r[strs[i].split("=")[0]]=unescape(strs[ i].split("=")[1]);
        }
    }
    return r;
}

function Menu(){
    this.pageArr = [];
    this.sourceArr = [];
    this.current = '';
    this.type = '';

    this.initPageArr();
    this.initSourceArr();
    this.initCurrent();
    this.init();
}

Menu.prototype.initPageArr = function(){
    var pageReg = /^Page/;
    for(var n in window){
        if(pageReg.exec(n) && window[n] instanceof Function){
            this.pageArr.push(n.replace(pageReg, ''));
        }
    }
    if(this.pageArr.length > 0){
        this.type = 'page';
        this.current = this.pageArr[0];
    }
}

Menu.prototype.initSourceArr = function(){
    var scripts = $('SCRIPT');
    var self = this;
    scripts.each(function(){
        var s = this.src.substr(this.src.lastIndexOf('/')+1);
        if(s[0] >= 'A' && s[0] <= 'Z'){
            s = s.substr(0, s.lastIndexOf('.'));
            self.sourceArr.push(s);
        }
    });
}

Menu.prototype.initCurrent = function(){
    var req = Request();
    if(typeof(req.op)!='undefined'){
        this.current = req.op;
    }
    if(typeof(req.type)!='undefined'){
        this.type = req.type;
    }
}

Menu.prototype.initPageList = function(page, head){
    this.liPage = $('<li />').appendTo(this.ul);
    this.headPage = $("<a class='head'>"+head+"</a>").appendTo(this.liPage);
    this.ulPage = $('<ul />').appendTo(this.liPage);
    var re = new RegExp('^'+page);
    for(var i = 0; i < this.pageArr.length; i++){
        var title = this.pageArr[i];
        if(re.exec(title)){
            var li = $('<li />');
            li.appendTo(this.ulPage);
            var a = $('<a />');
            if(title==this.current && this.type=='page'){
                a.addClass('curr');
            }
            a.appendTo(li);
            a.attr('href', '?type=page&op='+title);
            a.text(title.replace(re, ''));
        }
    }
}

Menu.prototype.init = function(){
    this.container = $("<div />")
        .css('visibility','hidden')
        .attr('id', 'navigation')
        .appendTo('body');
    
    
    this.ul = $('<ul />');
    this.ul.appendTo(this.container);
    
    this.initPageList('Base', '基本信息');
    this.initPageList('Block', '分块');
    this.initPageList('Cycle', '分环');
    
    
    this.liSource= $('<li />').appendTo(this.ul);
    this.headSource = $("<a class='head'>源代码</a>").appendTo(this.liSource);
    this.ulSource = $('<ul />').appendTo(this.liSource);
    
    for(var i = 0; i < this.sourceArr.length; i++){
        var title = this.sourceArr[i];
        var li = $('<li />');
        li.appendTo(this.ulSource);
        var a = $('<a />');
        if(title==this.current && this.type=='source'){
            a.addClass('curr');
        }
        a.appendTo(li);
        a.attr('href', '?type=source&op='+title);
        a.text(title+'.js');
    }
    
    $('a').mouseover(function(){
        $(this).addClass('focus');
    });
    $('a').mouseout(function(){
        $(this).removeClass('focus');
    });
}

Menu.prototype.show = function(x, y){
    this.x = x;
    this.y = y;
    this.container.css('left', this.x);
    this.container.css('top', this.y);
    this.container.css('visibility','visible');
    this.ul.accordion({
		active: true,
		header: '.head',
		navigation: true,
		event: 'click',
		fillSpace: true
	});
	
	var pageClass = null;
    var page = null;
    var margin = 0;

    if(this.type == 'page'){
        var pageName = 'Page' + this.current;
        if(typeof(window[pageName])!='undefined'){
            pageClass = window[pageName];
        }
        else{
            error(pageName + ' not found');
            return;
        }
        margin = 20;
    }
    else if(this.type == 'source'){
        pageClass = _PageSource(this.current);
        if(!pageClass){
            error(pageName + ' not found');
            return;
        }
        margin = 0;
    }

    page = new pageClass();
    
    if(page){
        page.show(($(document).width() - page.b.width())/2, y+margin);
    }
    else{
        error('wrong param');
    }
}
