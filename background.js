var running=false;
chrome.browserAction.onClicked.addListener(function(tab) {
    if(running){
        chrome.tabs.sendMessage(tab.id,"bail");
    }
    chrome.tabs.executeScript(null, {file: "fragments.js"});
    running=true;
});
