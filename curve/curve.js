function Curve() {
    this.size = 0.1;

    this.x = 50;
    this.y = 50;
    this.stepx = 10;
    this.stepy = 4;
    this.interval = 10;

    this.theta = 0;
    this.step = 0.01;
    this.times = 100;
    this.R = 200;
    this.r = 101;
    this.a = 49;

    this.m = Math.max(this.R, this.r, this.a);
    //RRGGBB
    // red green blue
    this.colors = ['black'];
    this.colorIndex = 0;


    this.container = $('<div></div>')
        .appendTo($('body'))
        .offset({ 'left': this.x, 'top': this.y })
        .width(this.w + this.size)
        .height(this.h + this.size)
        .addClass('container');

    this.canvas = $('<canvas></canvas>')
        .appendTo(this.container)
        .css('border', '1px solid blue');
    this.canvas.get(0).width = this.m * 2;
    this.canvas.get(0).height = this.m * 2;

    console.log(this.canvas);
    this.context = this.canvas.get(0).getContext('2d');
    this.context.fillStyle = this.colors[this.colorIndex];
    this.context.beginPath();

    var x = this.R - this.r + this.a;
    var y = this.R;
    x += this.m;
    y += this.m;
    y = 2 * this.m - y;
    this.context.moveTo(x, y);

    this.ele = $('<div></div>')
        .appendTo(this.container)
        .addClass('Curve')
        .html('')
        .width(this.size)
        .height(this.size)
        ;

    var self = this;
    var running = false;

    this.btn = $('<button></button>')
        .appendTo(this.container)
        .css('position', 'absolute')
        .css('top', this.m * 2)
        .css('left', 0)
        .html('start')
        .click(function () {
            if (!running) {
                running = true;
                self.btn.html('stop');
                self.start();
            }
            else {
                running = false;
                self.btn.html('start');
                self.stop();
            }
        });
}

Curve.prototype.start = function () {
    var self = this;
    this.timer = setInterval(function () {
        for (var i = 0; i < self.times; i++) {
            self.next();
        }
    }, 10);
};

Curve.prototype.stop = function () {
    clearInterval(this.timer);
}

Curve.prototype.pen = function (x, y) {
    this.ele.offset({
        'left': x + this.x,
        'top': y + this.y,
    });

}
Curve.prototype.point = function (x, y) {
    // console.log(x, y);
    this.pen(x, y);
    this.context.fillRect(x, y, 1, 1);
    // this.context.lineTo(offset.left, offset.top);
    // this.context.stroke();
    // var dot = $('<div></div>')
    //     .addClass('dot')
    //     .offset(offset)
    //     .appendTo($('body'));
}


Curve.prototype.next = function () {
    this.theta += this.step;
    // this.colorIndex = Math.ceil(this.theta / (2 * Math.PI)) % this.colors.length;
    // console.log(this.colorIndex);
    // this.context.fillStyle = this.colors[this.colorIndex];
    var x = (this.R - this.r) * Math.cos(this.theta) + this.a * Math.cos(1.0 * (this.R - this.r) / this.r * this.theta);
    var y = (this.R - this.r) * Math.sin(this.theta) - this.a * Math.sin(1.0 * (this.R - this.r) / this.r * this.theta);
    x += this.m;
    y += this.m;
    y = 2 * this.m - y;
    this.point(x, y);
};

$(document).ready(function () {
    new Curve();
});