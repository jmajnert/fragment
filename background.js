var running = false;
chrome.browserAction.onClicked.addListener(function(tab) {
    if(running){
        chrome.tabs.sendMessage(tab.id, "bail");
        running = false;
        return;
    }
    chrome.tabs.executeScript(null, {file: "fragments.js"});
    running = true;
});
chrome.runtime.onMessage.addListener(function () {
    //bailing
    running = false;
});
