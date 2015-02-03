var running = false;
function wrapUp(){
    running = false;
    chrome.browserAction.setIcon({path: "icon.png"});
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(running){
        chrome.tabs.sendMessage(tab.id, "bail");
        wrapUp();
        return;
    }
    chrome.tabs.executeScript(null, {file: "fragments.js"});
    chrome.browserAction.setIcon({path: "icon_red.png"});
    running = true;
});
chrome.runtime.onMessage.addListener(function () {
    wrapUp();
});
