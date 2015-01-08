(function (){
var color;
var last_element=null;
function clean_last_element(){
    if(last_element){
        last_element.style.backgroundColor=color;
        last_element.removeEventListener("click",copy_url,true);
    }
}
function cleanup(){
    clean_last_element();
}
function copy_url(e){
    var url=""+doc.location;
    var idx=url.indexOf("#");
    if(idx>0){
        url=url.slice(0,idx);
    }
    var identifier=last_element.id;
    if(id_list.indexOf(identifier)==-1)identifier=last_element.name;
    url+="#"+identifier;
    self.port.emit("URL",url);
    cleanup();
    e.preventDefault();
    e.stopPropagation();
}
function taint(target){
    clean_last_element();
    last_element=target;
    color=target.style.backgroundColor;
    target.style.backgroundColor="red";
    target.addEventListener("click",copy_url,true);
}
function handler(e){
  var o=e.target;
  while(o.id == "" || document.getElementById(o.id) != o){
    //alert(o);
    if(o.parentElement == document.body) return;
    o=o.parentElement;
  }
  id=o.id;
  taint(o);
}
function start(){
    document.body.addEventListener("mousemove",handler);
}
start();
self.port.on("detach", function() {
    cleanup();
});
})();
