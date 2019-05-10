function LifeGame() {
    var self = this;

    window.randInit2 = function () {
        self.onClickRandInit(2);
    }
    window.randInit4 = function () {
        self.onClickRandInit(4);
    }
    window.randInit8 = function () {
        self.onClickRandInit(8);
    }
    window.stop = function () {
        self.onClickStop();
    }
    window.play = function () {
        self.onClickPlay();
    }

    window.next = function () {
        self.onClickNext();
    }

    window.clearBoard = function () {
        self.onClickClear();
    }
}

LifeGame.prototype.init = function () {
    // width * height 个格子
    this.width = parseInt($('#w').val());
    this.height = parseInt($('#h').val());

    // 每个格式的大小
    this.size = parseInt($('#size').val());
    this.size1 = this.size + 1;

    // 两种颜色
    this.deadColor = 'white';
    this.lifeColor = $('#color').val();

    // 迭代间隔
    this.speed = parseInt($('#speed').val());
    this.interval = 1000 / this.speed;

    // 两个矩阵
    this.matrixArr = [];
    for (var i = 0; i < 2; i++) {
        this.matrixArr[i] = [];
        var matrix = this.matrixArr[i];
        for (var y = 0; y < this.height; y++) {
            var line = [];
            matrix[y] = line;
            for (var x = 0; x < this.width; x++) {
                line[x] = false;
            }
        }
    }

    // 世代
    this.generation = 0;
    this.eGeneration = $('#generation');
    this.eGeneration.val(this.generation);

    // 鼠标画图
    this.mouseDraw = false;

    this.container = $('#container');
    console.log(this.container.get(0));
    this.container.html('');
    this.container
        .width(this.width * this.size1)
        .height(this.height * this.size1)
        .addClass('container');

    this.canvas = $('<canvas></canvas>')
        .appendTo(this.container)
        .css('position', 'absolute')
        .css('border', '1px solid blue');
    console.log(this.canvas);
    this.canvas.get(0).width = this.width * this.size1;
    this.canvas.get(0).height = this.height * this.size1;

    this.context = this.canvas.get(0).getContext('2d');

    var self = this;
    var cs = this.canvas.get(0);
    cs.addEventListener('click', function (e) {
        self.onCanvasClick(e);
    });
    cs.addEventListener('mousedown', function (e) {
        self.onCanvasMouseDown(e);
    });
    cs.addEventListener('mouseup', function (e) {
        self.onCanvasMouseUp(e);
    });
    cs.addEventListener('mouseover', function (e) {
        self.onCanvasMouseOver(e);
    });
    cs.addEventListener('mousemove', function (e) {
        self.onCanvasMouseMove(e);
    });

    cs.addEventListener('mouseout', function (e) {
        self.onCanvasMouseOut(e);
    });

    this.draw();
}

LifeGame.prototype.onClickClear = function () {
    console.log('clear');
    this.stop();
    var matrix = this.matrixArr[0];
    for (var y = 0; y < this.height; y++) {
        var line = matrix[y];
        for (var x = 0; x < this.width; x++) {
            line[x] = false;
        }
    }
    this.draw();
}
LifeGame.prototype.onCanvasMouseDown = function (e) {
    // console.log('mouse down');
    var pos = this.getEventPosition(e);
    this.mouseDraw = true;
}

LifeGame.prototype.onCanvasMouseUp = function (e) {
    // console.log('mouse up');
    var pos = this.getEventPosition(e);
    this.mouseDraw = false;
}

LifeGame.prototype.onCanvasMouseOut = function (e) {
    // console.log('mouse out');
    var pos = this.getEventPosition(e);
    this.mouseDraw = false;
}

LifeGame.prototype.onCanvasMouseOver = function (e) {
    // console.log('mouse over');
    if (this.mouseDraw) {
        this.onCanvasClick(e);
    }
}

LifeGame.prototype.onCanvasMouseMove = function (e) {
    console.log('mouse move');
    if (this.mouseDraw) {
        this.onCanvasClick(e);
    }
}


LifeGame.prototype.onCanvasClick = function (e) {
    var pos = this.getEventPosition(e);
    // console.log(pos);
    var x = Math.floor(pos.x / this.size1);
    var y = Math.floor(pos.y / this.size1);
    var matrix = this.matrixArr[0];
    matrix[y][x] = true;
    this.draw();
}

LifeGame.prototype.getEventPosition = function (ev) {
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    }
    else if (ev.offsetX || ev.offsetX == 0) {
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return { x: x, y: y };
}

LifeGame.prototype.randInit = function (n) {
    this.init();
    var matrix = this.matrixArr[0];
    for (var y = 0; y < this.height; y++) {
        var line = matrix[y];
        for (var x = 0; x < this.width; x++) {
            line[x] = this.randInt(0, n - 1) == 0;
        }
    }
    this.draw();
    this.start();
}
LifeGame.prototype.onClickRandInit = function (n) {
    console.log('onClickRandInit');
    this.randInit(n);
}

LifeGame.prototype.onClickStop = function () {
    console.log('onClickStop');
    this.stop();
}

LifeGame.prototype.onClickPlay = function () {
    console.log('onClickPlay');
    this.start();
}

LifeGame.prototype.onClickNext = function () {
    console.log('onClickNext');
    this.next();
    this.draw();
}

LifeGame.prototype.draw = function () {
    // console.log('draw');
    var matrix = this.matrixArr[0];
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var color;
            if (matrix[y][x]) {
                color = this.lifeColor;
            }
            else {
                color = this.deadColor;
            }
            this.context.fillStyle = color;
            this.context.fillRect(x * this.size1, y * this.size1, this.size, this.size);
        }
    }
    this.eGeneration.val(this.generation);
}

LifeGame.prototype.start = function () {
    console.log('start');
    var self = this;
    clearInterval(this.timer);
    this.timer = setInterval(function () {
        self.draw();
        self.next();
    }, self.interval);
};

LifeGame.prototype.next = function () {
    // console.log('next');
    var matrix = this.matrixArr[0];
    var next = this.matrixArr[1];

    // next=matrix
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            next[y][x] = matrix[y][x];
        }
    }

    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var num = 0;
            // 统计邻居
            for (var j = y - 1; j < y + 2; j++) {
                for (var i = x - 1; i < x + 2; i++) {
                    if (0 <= i && 0 <= j && i < this.width && j < this.height && !(i == x && j == y)) {
                        // console.log('check', j, i, matrix[j][i]);
                        if (matrix[j][i]) {
                            num++;
                        }
                    }
                }
            }
            // 下一周期的状态
            // console.log(y, x, num);
            if (matrix[y][x] && num < 2) {
                next[y][x] = false;
            }
            if (matrix[y][x] && num > 3) {
                next[y][x] = false;
            }
            if (num == 2 || num == 3) {
                next[y][x] = matrix[y][x];
            }
            if (!matrix[y][x] && num == 3) {
                next[y][x] = true;
            }
        }
    }

    // matrix = next
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            matrix[y][x] = next[y][x];
        }
    }
    this.generation += 1;
}

LifeGame.prototype.randColor = function () {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
}

LifeGame.prototype.randInt = function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

LifeGame.prototype.randBoolean = function () {
    return !!(this.randInt(0, 100) % 2);
}

LifeGame.prototype.stop = function () {
    this.draw();
    clearInterval(this.timer);
}

$(document).ready(function () {
    new LifeGame();
});