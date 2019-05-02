function Curve() {
    var self = this;
    this.size = 0.1;

    this.x = 50;
    this.y = 50;
    this.stepx = 10;
    this.stepy = 4;
    this.interval = 10;

    this.theta = 0;
    this.step = 0.001;
    this.times = 200;
    this.R = 200;
    this.r = 101;
    this.d = 49;

    this.a1 = 1.0;
    this.a2 = 1.0;
    this.a3 = 1.0;
    this.a4 = 1.0;

    this.color = '#000000';

    this.container = $('#container');
    this.btnPlay = $('#btnPlay');

    window.defaultstart = function () {
        self.onclickDefaultStart();
    }
    window.start = function () {
        self.onclickStart();
    }

    window.randomstart0 = function () {
        self.onclickRandomStart0()
    }
    window.randomstart12 = function () {
        self.onclickRandomStart12()
    }
    window.randomstart34 = function () {
        self.onclickRandomStart34()
    }
    window.randomstart13 = function () {
        self.onclickRandomStart13()
    }
    window.randomstart24 = function () {
        self.onclickRandomStart24()
    }

    window.randomstart1234 = function () {
        self.onclickRandomStart24()
    }
}

Curve.prototype.onclickDefaultStart = function () {
    $('#R').val(300);
    $('#r').val(113);
    $('#d').val(51);
    $('#color').val('#ff0000');
    $('#a1').val(1.0);
    $('#a2').val(1.0);
    $('#a3').val(1.0);
    $('#a4').val(1.0);
    this.onclickStart();
}

Curve.prototype.random0 = function () {
    this.R = parseInt($('#R').val());
    var r = this.randInt(1, this.R);
    var d = this.randInt(1, r);
    $('#r').val(r);
    $('#d').val(d);
    $('#color').val(this.randColor());
    $('#a1').val(1.0);
    $('#a2').val(1.0);
    $('#a3').val(1.0);
    $('#a4').val(1.0);
}
Curve.prototype.onclickRandomStart0 = function () {
    this.random0();
    this.onclickStart();
}

Curve.prototype.randArg = function () {
    // return this.randInt(1, 4);
    return 5 * Math.random();
}

Curve.prototype.onclickRandomStartX = function (x) {
    this.random0()
    var arr = "1234";
    var i;
    for (i = 0; i < arr.length; i++) {
        var n = arr[i];
        if (x.indexOf(n) != -1) {
            $('#a' + n).val(this.randArg());
        }
        else {
            $('#a' + n).val(1.0);
        }
    }
    this.onclickStart();
}

Curve.prototype.onclickRandomStart12 = function () {
    this.onclickRandomStartX('12');
}

Curve.prototype.onclickRandomStart34 = function () {
    this.onclickRandomStartX('34');
}

Curve.prototype.onclickRandomStart13 = function () {
    this.onclickRandomStartX('13');
}

Curve.prototype.onclickRandomStart24 = function () {
    this.onclickRandomStartX('24');
}
Curve.prototype.onclickRandomStart1234 = function () {
    this.onclickRandomStartX('1234');
}

Curve.prototype.onclickStart = function () {
    var self = this;
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
    this.R = parseInt($('#R').val());
    this.r = parseInt($('#r').val());
    this.d = parseInt($('#d').val());
    this.times = parseInt($('#speed').val());
    this.color = $('#color').val();
    this.a1 = parseFloat($('#a1').val());
    this.a2 = parseFloat($('#a2').val());
    this.a3 = parseFloat($('#a3').val());
    this.a4 = parseFloat($('#a4').val());

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