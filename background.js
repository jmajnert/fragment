var tabs = new Array();

function engage(tabid){
    tabs.push(tabid);
    chrome.tabs.executeScript(tabid, {file: "fragments.js"});
    chrome.browserAction.setIcon({tabId: tabid, path: "icon_red.png"});
}

function disengage(idx){
    var id = tabs[idx];
    tabs.splice(idx,1)
    chrome.tabs.sendMessage(id, "bail");
    chrome.browserAction.setIcon({tabId: id, path: "icon.png"});
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab.url.startsWith("http"))return;
    var idx = tabs.indexOf(tab.id);
    if(idx > -1) disengage(idx);
    else engage(tab.id);
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var idx = tabs.indexOf(sender.tab.id);
    if(idx > -1) disengage(idx);
});
