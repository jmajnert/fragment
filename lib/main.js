var self=require("sdk/self");
var widgets = require("sdk/widget");
var widget = widgets.Widget({
    id: "fragments",
    label: "Fragments",
    contentURL: self.data.url("icon.png"),
    onClick: function() {
        var clipboard=require("sdk/clipboard");
        var worker=require("sdk/tabs").activeTab.attach({
            contentScriptFile: self.data.url("fragments.js")
        });
        worker.port.on("URL",function(url){
            clipboard.set(url);
        });
    }
});
