var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var button;
var tabs=require("sdk/tabs");
var tabMap = new Map();
var { ToggleButton } = require("sdk/ui/button/toggle");
button = ToggleButton({
    id: "fragments",
    label: "Fragments",
    icon: {
        "32" : self.data.url("icon.png")
    },
    onClick: toggle
});
function toggle(){
    var tab=tabs.activeTab;
    var worker = tabMap.get(tab);
    if(worker){
        console.log("3");
        worker.destroy();
        tabMap.delete(tab);
    }else{
        console.log("2");
        worker = engage(tab);
        tabMap.set(tab, worker);
    }
}
function engage(tab){
    var worker = tab.attach({
        contentScriptFile: self.data.url("fragments.js")
    });
    worker.port.on("URL", function(url){
        clipboard.set(url);
        console.log("1");
        button.click();
    });
    worker.port.on("escape", function(reason) {
        button.click();
    });
    return tab;
}
exports.onUnload = function (reason){
    tabMap.forEach(function (worker, tab, map){
        worker.destroy();
    });
};
