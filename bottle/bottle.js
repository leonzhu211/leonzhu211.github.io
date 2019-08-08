function State(occupied, parent, action) {
    this.occupied = occupied;
    this.parent = parent;
    this.action = action;
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

function Puzzle() {
    var self = this;

    window.onClickStart = function() {
        self.onClickStart();
    };
}

Puzzle.prototype.init = function() {
    this.capacity = [13, 7, 19];
    this.occupied = [13, 7, 0];

    this.rootState = new State(this.occupied, null, 'init');
    this.actions = [
        '1->2', '1->3',
        '2->3', '2->1',
        '3->1', '3->2'
    ];
}

// 两个 10 升
Puzzle.prototype.goalTest = function(state) {
    var occupied = state.occupied.slice();
    occupied.sort();
    if (occupied[0] == 0 && occupied[1] == 10 && occupied[2] == 10) {
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
    // 要到源倒光，要么目标倒满
    var num = Math.min(water, space);

    // 没有实际动作
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
        this.printResult(state);
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
    for (var i = 0; i < path.length; i++) {
        var state = path[i];
        console.log(state.action, state.occupied);
    }
}

Puzzle.prototype.start = function() {
    console.log('start:', this.rootState.occupied);
    this.searchState(this.rootState);
    console.log('finished');
}

Puzzle.prototype.onClickStart = function() {
    this.init();
    this.start();
}

$(document).ready(function() {
    new Puzzle();
});