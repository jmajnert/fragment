(function (){
var color;
var lastElement = null;
var identifier;

function cleanLastElement(){
    if(lastElement){
        lastElement.style.backgroundColor = color;
    }
}
function cleanup(){
    cleanLastElement();
    stop();
}
function copyUrl(e){
    var url = "" + document.location;
    if(identifier){
        var idx = url.indexOf("#");
        if(idx > 0){
            url = url.slice(0, idx);
        }
        url += "#" + identifier;
    }
    self.port.emit("URL", url);
    e.preventDefault();
    e.stopPropagation();
}
function taint(target){
    cleanLastElement();
    lastElement = target;
    color = target.style.backgroundColor;
    target.style.backgroundColor = "red";
}
function howToReachElement(o){
    if(o.id != "" && document.getElementById(o.id) == o) return o.id;
    if(o.tagName == "A" && o.name != "" && document.getElementById(o.name) == null){
        for(var i = 0; i < document.anchors.length; i++){
            if(document.anchors[i].name == o.name) return o.name;
        }
    }
    return null;
}
function handler(e){
    var o = e.target;
    if(lastElement == o) return;
    identifier = howToReachElement(o);
    while(identifier == null){
        if(o == document.body || o.parentElement == document.body) return;
        o = o.parentElement;
        identifier = howToReachElement(o);
    }
    taint(o);
}
function escapeHandler(e){
    if(e.keyCode == 27){
        self.port.emit("bail", "esc pressed");
        e.stopPropagation();
    }
}
function start(){
    if(!document.body){
        self.port.emit("bail", "no document");
        return;
    }
    document.body.addEventListener("mousemove",handler);
    window.addEventListener("keydown", escapeHandler);
    window.addEventListener("click", copyUrl, true);
}
function stop(){
    document.body.removeEventListener("mousemove",handler);
    window.removeEventListener("keydown", escapeHandler);
    window.removeEventListener("click", copyUrl, true);
}
start();
self.port.on("detach", function() {
    cleanup();
});
})();
