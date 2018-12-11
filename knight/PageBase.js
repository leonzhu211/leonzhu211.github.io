function PageBaseTitle() {
    this.b = {
        width: function () {
            return 400;
        }
    };

    this.init = function () {}

    this.show = function (x, y) {
        $("<style> h1 {text-align: center;} h2 {font-family: 楷体,楷体_GB2312;}</style>").appendTo('body');
        $('<div />')
            .css('position', 'absolute')
            .css('left', x)
            .css('top', y)
            .css('width', this.b.width())
            .appendTo('body')
            .html("<h1>马周游问题</h1><h2>算法设计：分治法</h2><h2>指导老师：蔡茂国</h2><h2>小组成员：朱吕亮、饶伟、陈庆良</h2>");
    }

    this.init();
}

function PageBaseIntroduction() {
    this.b = {
        width: function () {
            return 400;
        }
    };

    this.init = function () {}

    this.show = function (x, y) {
        $('<div />')
            .css('position', 'absolute')
            .css('left', x)
            .css('top', y)
            .appendTo('body')
            .html("<h1>给出一个8x8的棋盘<br>一个放在棋盘某个位置上的马<br>规定马的走法为走“日”<br>是否可以恰好访问每个方格一次<br>[并回到起始位置]</h1>");
    }

    this.init();
}


function PageBaseBoard8x8() {
    this.b = new Board(8, 8);
    this.k = new Knight();
    this.k.bind(this.b);

    this.init = function () {}

    this.show = function (x, y) {
        this.b.show(x, y);
        this.k.posAt(P(0, 0));
    }

    this.init();
}

function PageBaseRule() {
    this.b = new Board(8, 8);
    this.multiPath = new MultiPath();
    this.colorArr = ['blue']

    this.init = function () {
        var path = new Path();
        var pos = P(3, 3);
        path.push(pos);
        for (var i = 0; i < RULE.length; i++) {
            var dir = DI(i);
            path.push(pos.next(dir));
            path.push(pos);
        }
        this.multiPath.push(path);
        this.multiPath.bind(this.b);
    }

    this.show = function (x, y) {
        this.b.show(x, y);
        this.multiPath.show(this.colorArr);
    }

    this.init();
}

function PageBaseRuleAnimate() {
    return _PageAnimateWrapper(PageBaseRule)();
}

function PageBaseDivide4x4x4() {
    this.b = new Board(8, 8);
    this.k = new Knight();
    this.k.bind(this.b);

    this.init = function () {}

    this.show = function (x, y) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                var b = new Board(4, 4);
                b.show(x + i * (b.width() + b.squareSize / 2), y + j * (b.height() + b.squareSize / 2));
            }
        }
    }

    this.init();
}

function PageBaseDivide16x2x2() {
    this.b = new Board(8, 8);
    this.k = new Knight();
    this.k.bind(this.b);

    this.init = function () {}

    this.show = function (x, y) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var b = new Board(2, 2);
                b.show(x + i * (b.width() + b.squareSize / 2), y + j * (b.height() + b.squareSize / 2));
            }
        }
    }

    this.init();
}

function PageBaseDivide64x1x1() {
    this.b = new Board(8, 8);
    this.k = new Knight();
    this.k.bind(this.b);

    this.init = function () {}

    this.show = function (x, y) {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var b = new Board(1, 1, (i + j) % 2);
                b.show(x + i * (b.width() + b.squareSize / 2), y + j * (b.height() + b.squareSize / 2));
            }
        }
    }

    this.init();
}