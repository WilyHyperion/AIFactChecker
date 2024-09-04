

    browser.runtime.onMessage.addListener(function(message) {

        console.log("Message from the background script:");
        if (message.command === "activate") {
            console.log("activated");
            activate();
        }
    });
let video;
let subtitles;
async function activate() {
    let videoslist = document.querySelectorAll('video');
    //todo user input for check
    video = videoslist[0];
   subtitles = document.querySelectorAll('.ytp-caption-segment');
   setInterval(check, 1000);
}
async function check() {
    let MutationObserver  = window.MutationObserver || window.WebKitMutationObserver;
    let currentTime = video.currentTime;
    let currentLine = ''
    for(let ob of subtitles){
        currentLine += ob.innerText + ' ';
    }
    subtitles = document.querySelectorAll('.ytp-caption-segment');
    console.log("current subtitles" + currentLine);

}
