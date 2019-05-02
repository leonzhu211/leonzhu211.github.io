function Curve() {
    var self = this;
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
    this.d = 49;

    this.color = '#000000';

    this.container = $('#container');
    this.btnPlay = $('#btnPlay');

    window.start = function () {
        self.init();
        self.start();
        var running = true;
        self.btnPlay.val('暂停');
        self.btnPlay.unbind("click");
        self.btnPlay
            .css('visibility', 'visible')
            .click(function () {
                if (!running) {
                    running = true;
                    self.btnPlay.val('暂停');
                    self.start();
                }
                else {
                    running = false;
                    self.btnPlay.val('继续');
                    self.stop();
                }
            });
    }
}

Curve.prototype.init = function () {
    this.r = parseInt($('#R').val());
    this.r = parseInt($('#r').val());
    this.d = parseInt($('#d').val());
    this.times = parseInt($('#speed').val());
    this.color = $('#color').val();

    this.theta = 0;
    clearInterval(this.timer);
    this.m = Math.max(this.R, this.r, this.d);

    console.log(this.container.get(0));
    this.container.html('');
    this.container
        .width(this.w + this.size)
        .height(this.h + this.size)
        .addClass('container');

    this.canvas = $('<canvas></canvas>')
        .appendTo(this.container)
        .css('border', '1px solid blue');
    console.log(this.canvas);
    this.canvas.get(0).width = this.m * 2;
    this.canvas.get(0).height = this.m * 2;

    this.context = this.canvas.get(0).getContext('2d');
    this.context.fillStyle = this.color;
    this.context.beginPath();

    var x = this.R - this.r + this.d;
    var y = this.R;
    x += this.m;
    y += this.m;
    y = 2 * this.m - y;
    this.context.moveTo(x, y);
}

Curve.prototype.start = function () {
    var self = this;
    this.timer = setInterval(function () {
        for (var i = 0; i < self.times; i++) {
            self.next();
        }
    }, self.interval);
};

Curve.prototype.stop = function () {
    clearInterval(this.timer);
}

Curve.prototype.point = function (x, y) {
    this.context.fillRect(x, y, 1, 1);
}


Curve.prototype.next = function () {
    this.theta += this.step;
    var x = (this.R - this.r) * Math.cos(this.theta) + this.d * Math.cos(1.0 * (this.R - this.r) / this.r * this.theta);
    var y = (this.R - this.r) * Math.sin(this.theta) - this.d * Math.sin(1.0 * (this.R - this.r) / this.r * this.theta);
    x += this.m;
    y += this.m;
    y = 2 * this.m - y;
    this.point(x, y);
};

$(document).ready(function () {
    new Curve();
});