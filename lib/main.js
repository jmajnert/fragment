var self=require("sdk/self");
var clipboard=require("sdk/clipboard");
var worker=null;
var button;
var { ToggleButton } = require("sdk/ui/button/toggle");
button = ToggleButton({
    id: "fragments",
    label: "Fragments",
    icon: {
        "32" : self.data.url("icon.png")
    },
    onClick: engage
});
function engage(){
    worker=require("sdk/tabs").activeTab.attach({
        contentScriptFile: self.data.url("fragments.js")
        });
    worker.port.on("URL",function(url){
        clipboard.set(url);
        button.click();
    });
    worker.port.on("escape", function(reason) {
        button.click();
    });
    button.removeListener("click",engage)
    button.on("click",disengage);
}
function disengage(){
    button.removeListener("click",disengage)
    button.on("click",engage);
    worker.destroy();
    worker=null;
}
exports.onUnload = function (reason){
    if(worker)worker.destroy();
};
