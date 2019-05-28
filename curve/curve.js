function Curve() {
    var self = this;
    this.size = 0.1;

    this.x = 50;
    this.y = 50;

    this.interval = 10;
    this.theta = 0;
    this.step = 0.001;

    this.times = 500;
    this.R = 700;
    this.r = parseInt(this.R / 2) + 7;
    this.d = parseInt(this.r / 2) + 7;

    this.a1 = 1.0;
    this.a2 = 1.0;
    this.a3 = 1.0;
    this.a4 = 1.0;

    this.color = this.randColor();

    this.container = $('#container');
    this.bar = $('#bar');
    this.btnPlay = $('#btnPlay');

    window.start = function () {
        self.onclickStart();
    }

    window.randomstart0 = function () {
        self.onclickRandomStart0()
    }
    window.randomstart1234 = function () {
        self.onclickRandomStart1234()
    }

    this.hashToParam();
    this.onclickStart();
}

Curve.prototype.paramToHash = function () {
    var hash = '#main';
    var arr = [this.r, this.d, this.a1, this.a2, this.a3, this.a4];
    for (var i = 0; i < arr.length; i++) {
        hash += '/' + arr[i];
    }
    console.log('param to hash:', hash);
    window.location.href = hash;
    console.log(window.location.href);
}

Curve.prototype.hashToParam = function () {
    var hash = window.location.hash;
    var arr = hash.split('/');
    console.log(arr);
    if (arr.length != 7) {
        console.log('arr length error');
        return;
    }
    var i = 1;
    this.r = parseFloat(arr[i++]);
    this.d = parseFloat(arr[i++]);
    this.a1 = parseFloat(arr[i++]);
    this.a2 = parseFloat(arr[i++]);
    this.a3 = parseFloat(arr[i++]);
    this.a4 = parseFloat(arr[i++]);
}


Curve.prototype.random0 = function () {
    this.r = this.randInt(1, this.R);
    this.d = this.randInt(1, this.r);
    this.color = this.randColor();
    this.a1 = 1.0;
    this.a2 = 1.0;
    this.a3 = 1.0;
    this.a4 = 1.0;
}

Curve.prototype.onclickRandomStart0 = function () {
    this.random0();
    this.onclickStart();
}

Curve.prototype.randArg = function () {
    // return this.randInt(1, 4);
    return Math.round(5 * Math.random() * 100) / 100;
}

Curve.prototype.onclickRandomStart1234 = function () {
    this.random0();
    var arr = ['1', '2', '3', '4', '12', '24', '13', '24', '1234'];
    var i = this.randInt(0, arr.length - 1);
    var e = arr[i];
    if (e.indexOf('1') >= 0) {
        this.a1 = this.randArg();
    }
    if (e.indexOf('2') >= 0) {
        this.a2 = this.randArg();
    }
    if (e.indexOf('3') >= 0) {
        this.a3 = this.randArg();
    }
    if (e.indexOf('4') >= 0) {
        this.a4 = this.randArg();
    }
    this.onclickStart();
}

Curve.prototype.onclickStart = function () {
    var self = this;
    this.paramToHash();
    this.init();
    this.start();
    var running = true;
    this.btnPlay.val('暂停');
    this.btnPlay.unbind("click");
    this.btnPlay
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
Curve.prototype.randColor = function () {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
}

Curve.prototype.randInt = function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

Curve.prototype.init = function () {
    this.theta = 0;
    clearInterval(this.timer);
    this.m = Math.max(this.R, this.r, this.d);

    console.log(this.container.get(0));
    this.container.html('');
    this.container
        .width(this.m * 2)
        .height(this.m * 2);
    this.bar.width(this.m * 2);

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
    var x = (this.R - this.r) * Math.cos(this.a1 * this.theta) + this.d * Math.cos(this.a2 * (this.R - this.r) / this.r * this.theta);
    var y = (this.R - this.r) * Math.sin(this.a3 * this.theta) - this.d * Math.sin(this.a4 * (this.R - this.r) / this.r * this.theta);
    x += this.m;
    y += this.m;
    y = 2 * this.m - y;
    this.point(x, y);
};

$(document).ready(function () {
    new Curve();
});