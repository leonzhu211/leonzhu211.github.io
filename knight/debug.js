function debug(s){
    var debugDiv = $('#debugdiv');
    if(!debugDiv.length){
        debugDiv = $('<div />')
        .attr('id','debugdiv')
        .css('z-index', 99999)
        .css('position', 'absolute')
        .css('top', '100px')
        .css('left', '500px')
        .appendTo('body');
    }
    debugDiv.html(debugDiv.html()+"<br>"+s);
}

function error(s){
    debug("<span style='color: red;'>"+s+"</span>");
}

function assert(c){
    if(!c){
        error('assert');
    }
}