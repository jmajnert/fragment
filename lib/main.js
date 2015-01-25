var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var button;
var tabs = require("sdk/tabs");
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
    //button-per-tab magic
    this.state('window', null);
    let { checked } = this.state('tab');
    this.state('tab', {checked: !checked});

    var tab = tabs.activeTab;
    var worker = tabMap.get(tab);
    if(worker){
        worker.destroy();
        tabMap.delete(tab);
        return;
    }
    worker = engage(tab);
    tabMap.set(tab, worker);
}
function engage(tab){
    var worker = tab.attach({
        contentScriptFile: self.data.url("fragments.js")
    });
    worker.port.on("URL", function(url){
        clipboard.set(url);
        button.click();
    });
    worker.port.on("bail", function(reason) {
        button.click();
    });
    return worker;
}
exports.onUnload = function (reason){
    tabMap.forEach(function (worker, tab, map){
        worker.destroy();
    });
};
