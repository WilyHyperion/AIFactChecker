chrome.runtime.onMessage.addListener(function (message) {
  console.log("Message from the background script:");
  if (message.command === "activate") {
    console.log("activated");
    activate();
  } else if (message.command === "toggleCaptions") {
    toggleCaptions();
  }
  else if (message.command == 'export') {
    exportdata()
  }
});
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

async function exportdata() {
  let file = {
    transcript: transcript,
    claims: facts
  }
  let str = JSON.stringify(file);
  download('data.json', str)
}
let facts = [];
let video;
let subtitles;
//todo change this back
//const host = "wss://super-meme-567qq96vwj9h7xqj-3000.app.github.dev/";
const host = "ws://localhost:3000";
let transcript = "";
let ws;
let factElement;
let title;
let captionsVisible1 = false;


async function activate() {
  if (factElement) {
    return;
  }
  title = document.querySelectorAll("#above-the-fold > #title > h1")[0]
    .children[0].innerHTML;
  let videoslist = document.querySelectorAll("video");

  // Open a websocket connection
  ws = new WebSocket(host);
  ws.onopen = function () {
    console.log("connected");
  };
  ws.onerror = function (e) {
    console.log(e);
    setErrorDisplay();
  };
  ws.onmessage = function (event) {
    let json = JSON.parse(event.data);
    for (let v of json) {
      addFact(v);
    }
  };
  video = videoslist[0];
  subtitles = document.querySelectorAll(".ytp-caption-segment");

  // Get HTML head element
  let head = document.getElementsByTagName("HEAD")[0];

  // Create new link Element
  let link = document.createElement("link");

  // Set the attributes for link element
  link.rel = "stylesheet";
  link.href =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  link.integrity =
    "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";

  // Append link element to HTML head
  head.appendChild(link);
  //take control of subtitles button and ensure their on
  let subbutton = document.querySelector(".ytp-subtitles-button");
  if(subbutton.getAttribute("aria-pressed") == "false"){
    subbutton.click();
  }
  let clone = subbutton.cloneNode(true);
  subbutton.parentNode.replaceChild(clone, subbutton);
  subbutton = clone;

  subbutton.addEventListener("click", function (e) {
    e.stopImmediatePropagation();
    captionsVisible1 = !captionsVisible1;
    captionsVisible();
  })
  document.addEventListener("keydown", function (e) {
    if (e.key === "c") {
      captionsVisible1 = !captionsVisible1;
      captionsVisible();
      e.stopImmediatePropagation();
    }
  });
  // Create sidebar for facts
  createSidebar();
  setInterval(check, 1000);
}

// function toggleCaptions() {
//   if(captionsVisible){
//     turnOffCaptions();
//   }
//   else{
//     turnOffCaptions();
//   }
//   captionsVisible = !captionsVisible;
// }


function turnOffCaptions() {
  console.log("turning off captions");
  const style = document.createElement('style');
  document.querySelectorAll("#ytp-caption-window-container").forEach((e) => {
    e.style.opacity = "0!important";
    e.style.fontSize = "0px!important";
    e.style.display = "hidden!important";
  });
  style.innerHTML = `
    .ytp-caption-segment {
      font-size: 0px !important;
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(style);
}
function turnOnCaptions() {
  const style = document.createElement('style');
  style.innerHTML = `
    .ytp-caption-segment {
      font-size: 15px !important;
      opacity: 50 !important;
    }
  `;
  document.head.appendChild(style);
}

// Call the function to inject the CSS
//turnOffCaptions();
function captionsVisible(){
  if(captionsVisible1 == false){
    turnOffCaptions();
  }
  else{
    turnOnCaptions();
  }
}




let dragx, dragy, oldx, oldy;
function move(e) {
  e.preventDefault();
  oldx = dragx - e.clientX;
  oldy = dragy - e.clientY;
  dragx = e.clientX;
  dragy = e.clientY;
  factElement.style.top = factElement.offsetTop - oldy + "px";
  factElement.style.left = factElement.offsetLeft - oldx + "px";
}
function createDragger() {
  let dragger = document.createElement("div");
  dragger.style.width = "100%";
  dragger.style.height = "10px";
  dragger.style.position = "absolute";
  dragger.style.top = "0";
  dragger.style.left = "0";
  dragger.style.cursor = "move";
  dragger.style.userSelect = "none";
  dragelement = dragger;
  dragger.style.backgroundColor = "rgba(50,50,50,1)";
  dragger.addEventListener("mousedown", function (e) {
    document.addEventListener("mousemove", move);
  });
  factElement.addEventListener("mouseup", function () {
    document.removeEventListener("mousemove", move);
  });
  return dragger;
}
function createSidebar() {
  factElement = document.createElement("div");
  factElement.appendChild(createDragger());
  factElement.classList.add("card");
  factElement.style.position = "fixed";
  factElement.style.top = "5%";
  factElement.style.right = "0";
  factElement.style.width = "300px";
  factElement.style.height = "80vh";
  factElement.style.backgroundColor = "rgba(1,1,1,0.1)";
  factElement.style.overflow = "scroll";
  factElement.style.zIndex = "2301";
  factElement.style.border = "1px solid black";
  factElement.style.padding = "10px";
  factElement.style.paddingTop = "20px";
  factElement.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
  factElement.style.resize = "both";

  document.body.appendChild(factElement);
}

let lastlineadded = "";
async function check() {
  let currentLine = "";
  for (let ob of subtitles) {
    currentLine += ob.innerText + " ";
  }
  if (
    transcript.substring(transcript.length - currentLine.length) !== currentLine
  ) {
    if (currentLine.includes(lastlineadded)) {
      newsection = currentLine.substring(
        currentLine.indexOf(lastlineadded) + lastlineadded.length
      );
    } else {
      newsection = currentLine;
    }
    transcript += newsection;
    lastlineadded = currentLine;
    checkSend();
  }
  subtitles = document.querySelectorAll(".ytp-caption-segment");
  console.log("current transcript: " + transcript.substring(sent.length));
}

let sent = 0;
const CHUNK_SIZE = 300;
async function checkSend() {
  let toSend = transcript.substring(Math.max(0, sent - 50), sent + CHUNK_SIZE);
  if (toSend.length >= CHUNK_SIZE) {
    try{
      console.log(ws.readyState, 'state');
    ws.send(JSON.stringify({ title: title, data: toSend, long: transcript.substring(Math.max(0, sent - 3000), sent + CHUNK_SIZE) }));
    }catch(e){
      console.log("error");
      setErrorDisplay();
    }
    sent += CHUNK_SIZE;
  }
}
async function setErrorDisplay(params) {
  console.log("error occured");
  factElement.innerHTML = `
  <div style="display: flex; align-items: center;">
    <h1 style="color: red;">A factchecking error has occured. Please reload the page or try again later</h1>
  </div>
  `
  factElement.style.backgroundColor = "rgba(255,0,0,0.1)";
}
async function addFact(params) {
  facts.push(params);
  let fact = document.createElement("div");
  fact.style.border = "1px solid black";
  fact.style.margin = "10px";
  fact.style.padding = "10px";
  fact.style.cursor = "pointer";
  fact.style.transition = "all 0.3s ease";
  fact.style.borderRadius = "5px";
  fact.style.boxShadow = "0 0 5px rgba(0,0,0,0.2)";
  fact.classList.add("fact-box");
  fact.style.fontSize = "12px";  // Adjust this value to the desired font size


  // Add appropriate styling based on the fact's validity
  if (params.validity.includes("true")) {
    fact.style.backgroundColor = "#d4edda"; // Green for true
    fact.innerHTML = `
    <div style="display: flex; align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16" >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>
      <strong>True</strong>
    </div>
    <div class="fact-detail" style="display: block;">
      <p><strong>Statement:</strong> ${params.statement}</p>
      <p><strong>Reasoning:</strong> ${params.reason}</p>
    </div>
  `;
  } else if (params.validity.includes("false")) {
    fact.style.backgroundColor = "#f8d7da"; // Red for false
    fact.innerHTML = `
      <div style="display: flex; align-items: center;">
        <svg fill="#ff0017" width="16" height="16" viewBox="-1.7 0 20.4 20.4" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><path d="M16.406 10.283a7.917 7.917 0 1 1-7.917-7.917 7.916 7.916 0 0 1 7.917 7.917zM9.48 14.367a1.003 1.003 0 1 0-1.004 1.003 1.003 1.003 0 0 0 1.004-1.003zM7.697 11.53a.792.792 0 0 0 1.583 0V5.262a.792.792 0 0 0-1.583 0z"/></svg>
        <strong>False</strong>
      </div>
      <div class="fact-detail" style="display: block;">
        <p><strong>Statement:</strong> ${params.statement}</p>
        <p><strong>Reasoning:</strong> ${params.reason}</p>
      </div>
    `;
  } else {
    console.log("should not answer so didnt add thing");
    return;
  }
  factElement.prepend(fact);
}

