console.log("popup.js loaded");

{
    document.addEventListener('click', (e) => {
        if(e.target.id === "startButton") {
            browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                browser.tabs.sendMessage(tabs[0].id, {command: "activate"});
            });
        }
    });

}