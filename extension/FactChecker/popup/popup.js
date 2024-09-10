console.log("popup.js loaded");

{
    document.addEventListener('click', (e) => {
        if(e.target.id === "startButton") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: "activate"});
            });
        }
        else if(e.target.id === "captionButton") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: "toggleCaptions"});
            });
        }
    });

}