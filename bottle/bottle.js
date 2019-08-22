function State(occupied, parent, action) {
    this.occupied = occupied;
    this.action = action;
    this.parent = parent;
    this.children = [];
    if (parent != null) {
        parent.children.push(this);
    }
}

State.prototype.equal = function(state) {
    return this.occupied[0] == state.occupied[0] && this.occupied[1] == state.occupied[1] && this.occupied[2] == state.occupied[2];
}

State.prototype.inPath = function(child) {
    var state = this;
    while (state != null) {
        if (state.equal(child)) {
            return true;
        }
        state = state.parent;
    }
    return false;
}

State.prototype.getPathLength = function() {
    var state = this;
    var len = 0;
    while (state != null) {
        len++;
        state = state.parent;
    }
    return len;
}

function Puzzle() {
    var self = this;

    window.onClickStart = function() {
        self.onClickStart();
    };
}

Puzzle.prototype.init = function() {
    var a = parseInt($('#a').val());
    var b = parseInt($('#b').val());
    var c = parseInt($('#c').val());
    var ga = parseInt($('#ga').val());
    var gb = parseInt($('#gb').val());
    var gc = parseInt($('#gc').val());
    this.capacity = [a, b, c];
    this.occupied = [a, b, 0];
    this.goal = [ga, gb, 0]

    this.rootState = new State(this.occupied, null, 'init');
    this.actions = [
        '1->2', '1->3',
        '2->3', '2->1',
        '3->1', '3->2'
    ];

    this.resultStates = [];
}

// 两个 10 升
Puzzle.prototype.goalTest = function(state) {
    var occupied = state.occupied.slice();
    var goal = this.goal.slice();
    goal.sort();
    occupied.sort();
    if (occupied[0] == goal[0] && occupied[1] == goal[1] && occupied[2] == goal[2]) {
        return true;
    } else {
        return false;
    }
}

/* 
action 由 1->2 标识
*/
Puzzle.prototype.doAction = function(state, action) {
    var arr = action.split('->');
    var src = parseInt(arr[0]) - 1;
    var dst = parseInt(arr[1]) - 1;

    // 复制状态
    var occupied = state.occupied.slice();

    // 有多少水
    var water = occupied[src];

    // 有多少空间
    var space = this.capacity[dst] - occupied[dst];

    // 倒水的量
    var num = Math.min(water, space);

    // 没有实际动作
    // 源已经倒光了
    // 或目标已经满了
    if (num == 0) {
        return null;
    }

    occupied[src] -= num;
    occupied[dst] += num;

    var child = new State(occupied, state, action);
    return child;
}



Puzzle.prototype.searchState = function(state) {
    //console.log('search', state.occupied);
    if (this.goalTest(state)) {
        this.resultStates.push(state);
        return;
    }
    for (var i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];
        var child = this.doAction(state, action);
        if (child != null && !state.inPath(child)) {
            this.searchState(child);
        }
    }
}

Puzzle.prototype.printResult = function(state) {
    var path = [];
    while (state != null) {
        path.push(state);
        state = state.parent;
    }
    path.reverse();
    var output = $('#resultOutput');
    output.empty();
    for (var i = 0; i < path.length; i++) {
        var state = path[i];
        var step = $("<div></div>");
        output.append(step);
        var action = $("<span>" + state.action + "</span>");
        action.addClass('action');
        step.append(action);
        for (var j = 0; j < state.occupied.length; j++) {
            var value = state.occupied[j];
            var occupied = $("<span>" + value + "</span>");
            step.append(occupied);
            occupied.addClass('occupied');
        }
    }
}

Puzzle.prototype.printResultList = function() {
    for (var i = 0; i < this.resultStates.length; i++) {
        var state = this.resultStates[i];
        console.log(i, state.getPathLength());
    }
}

Puzzle.prototype.numberPrefix = function(num, max) {
    var p = 1;
    var i = 0;
    while (i < max) {
        p *= 10;
        if (p > num) {
            break;
        }
        i++;
    }
    var prefix = '';
    for (var j = 0; j < max - i - 1; j++) {
        prefix += '&nbsp;';
    }
    return prefix + num;
}

Puzzle.prototype.fillResultSelector = function() {
    var self = this;
    var selector = $('#resultSelector');
    selector.empty();
    selector.css('display', 'block');
    selector.on('change', function() {
        var idx = selector.val();
        var state = self.resultStates[idx];
        self.printResult(state);
    });
    for (var i = 0; i < this.resultStates.length; i++) {
        var state = this.resultStates[i];
        var option = $('<OPTION></OPTION');
        option.html(this.numberPrefix(i + 1, 4) + ': ' + (state.getPathLength() - 1) + '步');
        option.val(i);
        selector.append(option);
    }
    selector.trigger('change');
}

Puzzle.prototype.start = function() {
    this.searchState(this.rootState);
    this.resultStates.sort(function(a, b) {
        return a.getPathLength() - b.getPathLength();
    });
    if (this.resultStates.length == 0) {
        $('#resultSelector').css('display', 'none');
        $('#resultOutput').html('未找到任何解决方案');
    } else {
        this.fillResultSelector();
    }
}

Puzzle.prototype.onClickStart = function() {
    this.init();
    this.start();
}

$(document).ready(function() {
    new Puzzle();
});