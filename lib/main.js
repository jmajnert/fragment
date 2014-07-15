var self=require("sdk/self");
var clipboard=require("sdk/clipboard");
var worker=null;
function destroy_worker(){
    worker.port.emit("bail");
    worker.destroy();
    worker=null;
}
var widget = require("sdk/widget").Widget({
    id: "fragments",
    label: "Fragments",
    contentURL: self.data.url("icon.png"),
    onClick: function() {
        if(worker){
            destroy_worker();
            return;
        }
        worker=require("sdk/tabs").activeTab.attach({
            contentScriptFile: self.data.url("fragments.js")
        });
        worker.port.on("URL",function(url){
            clipboard.set(url);
            destroy_worker();
        });
    }
});
