
chrome.runtime.onMessage.addListener(function (message) {
  console.log("Message from the background script:");
  if (message.command === "activate") {
    console.log("activated");
    activate();
  }
});

let facts = [];
let video;
let subtitles;
const host = "ws://localhost:3000";
let transcript = "";
let ws;
let factElement;
async function activate() {
  let videoslist = document.querySelectorAll("video");
  //open a websocket connection
  ws = new WebSocket(host);
  ws.onopen = function () {
    console.log("connected");
  };
  ws.onmessage = function (event) {
    console.log("received: " + event.data);
    addFact(JSON.parse(event.data));
  };
  video = videoslist[0];
  subtitles = document.querySelectorAll(".ytp-caption-segment");
  setInterval(check, 1000);
  factElement = document.createElement("div");
  factElement.style.position = "fixed";
  factElement.style.top = "5%";
  factElement.style.left = "0";
  factElement.style.width = "300px";
  factElement.style.height = "80vh";
  factElement.style.backgroundColor = "white";
  factElement.style.overflow = "scroll";
  factElement.style.zIndex = "1000";
  factElement.style.border = "1px solid black";
    factElement.style.padding = "10px";
  document.body.appendChild(factElement);
}
async function check() {
  let currentTime = video.currentTime;
  let currentLine = "";
  for (let ob of subtitles) {
    currentLine += ob.innerText + " ";
  }
  if (
    transcript.substring(transcript.length - currentLine.length) !== currentLine
  ) {
    transcript += currentLine;
    checkSend();
  }
  subtitles = document.querySelectorAll(".ytp-caption-segment");
  console.log("current subtitles" + currentLine);
}
let sent = "";
async function checkSend() {
  let toSend = transcript.substring(sent.length);
  if (toSend.includes(".") || toSend.includes("?") || toSend.includes("!")) {
    let statements = toSend.split(/\.|\?|\!/);
    for (let s of statements.splice(0, statements.length - 1)) {
      sent += s + ".";
      ws.send(JSON.stringify({ data: s }));
    }
  }
}

async function addFact(params) {
  facts.push(params);
  let fact = document.createElement("div");
  fact.style.border = "1px solid black";
    fact.style.margin = "10px";
fact.style.padding = "10px";
console.log(params);
  fact.innerText = params.fact + ":" + params.data;
  factElement.appendChild(fact);
}
