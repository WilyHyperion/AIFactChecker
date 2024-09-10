chrome.runtime.onMessage.addListener(function (message) {
  console.log("Message from the background script:");
  if (message.command === "activate") {
    console.log("activated");
    activate();
  }
  else if (message.action === 'toggleCaptions') {
    toggleCaptions();
  }
});

let facts = [];
let video;
let subtitles;
const host = "ws://localhost:3000";
let transcript = "";
let ws;
let factElement;
let title;
let captionsVisible = true;


async function activate() {
  title = document.querySelectorAll('#above-the-fold > #title > h1')[0].children[0].innerHTML
  let videoslist = document.querySelectorAll("video");

  // Open a websocket connection
  ws = new WebSocket(host);
  ws.onopen = function () {
    console.log("connected");
  };
  ws.onmessage = function (event) {
    let json = JSON.parse(event.data)
    for(let v of json){
      addFact(v);
    }
  };
  video = videoslist[0];
  subtitles = document.querySelectorAll(".ytp-caption-segment");

  // Get HTML head element
  let head = document.getElementsByTagName('HEAD')[0];

  // Create new link Element
  let link = document.createElement('link');

  // Set the attributes for link element
  link.rel = 'stylesheet';
  link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  link.integrity = "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";

  // Append link element to HTML head
  head.appendChild(link);

  // Create sidebar for facts
  createSidebar();
  setInterval(check, 1000);
}

function toggleCaptions() {
  const captions = document.querySelectorAll('.caption-window');
  captions.forEach(caption => {
    caption.style.display = captionsVisible ? 'none' : 'block';
  });
  captionsVisible = !captionsVisible;
}

function createSidebar() {
  // Create sidebar element
  factElement = document.createElement("div");
  factElement.classList.add("card");
  factElement.style.position = "fixed";
  factElement.style.top = "5%";
  factElement.style.right = "0";
  factElement.style.width = "300px";
  factElement.style.height = "80vh";
  factElement.style.backgroundColor = "rgba(1,1,1,0.1)";
  factElement.style.overflow = "scroll";
  factElement.style.zIndex = "1000";
  factElement.style.border = "1px solid black";
  factElement.style.padding = "10px";
  factElement.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
  document.body.appendChild(factElement);
}
let lastlineadded = "";
async function check() {

  //turn on captions
  function toggleCaptions() {
    const captions = document.querySelectorAll('.caption-window');
    captions.forEach(caption => {
      caption.style.display = captionsVisible ? 'none' : 'block';
    });
    captionsVisible = !captionsVisible;
  }
  
  let currentLine = "";
  for (let ob of subtitles) {
    currentLine += ob.innerText + " ";
  }
  if (transcript.substring(transcript.length - currentLine.length) !== currentLine) {
    if(currentLine.includes(lastlineadded)) {
      newsection = currentLine.substring(currentLine.indexOf(lastlineadded) + lastlineadded.length);
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
const CHUNK_SIZE = 500;
async function checkSend() {
  console.log(title)
  let toSend = transcript.substring(Math.max(0, sent - 50), sent + CHUNK_SIZE)
  console.log(sent);
  console.log(toSend.length);
  if (toSend.length >= CHUNK_SIZE) {
    ws.send(JSON.stringify({title: title,  data: toSend}));
    sent += CHUNK_SIZE;
  }
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

  // Add appropriate styling based on the fact's validity

  if (params.validity.includes("true")) {
   // alert('true: \n' + params.fact)
    fact.style.backgroundColor = "#d4edda"; // Green for true
    fact.innerHTML = `
    <div style="display: flex; align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16" >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          <g>
            <path style="fill:#010002;" d="M155.139,0C69.598,0,0,69.598,0,155.139c0,85.547,69.598,155.139,155.139,155.139
              c85.547,0,155.139-69.592,155.139-155.139C310.277,69.598,240.686,0,155.139,0z M144.177,196.567L90.571,142.96l8.437-8.437
              l45.169,45.169l81.34-81.34l8.437,8.437L144.177,196.567z"/>
          </g>
        </svg>
      <strong>True</strong>
    </div>
    <div class="fact-detail" style="display: block;">
      <p><strong>Statement:</strong> ${params.statement}</p>
      <p><strong>Reasoning:</strong> ${params.reason}</p>
    </div>
  `;
  } else if(params.validity.includes("false")) {
  //  alert('false: \n' + params.fact)
    fact.style.backgroundColor = "#f8d7da"; // Red for false
    fact.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span class="material-icons" style="#f2ff00; margin-right: 10px;">warning</span>
        <strong>False</strong>
      </div>
      <div class="fact-detail" style="display: block;">
        <p><strong>Statement:</strong> ${params.statement}</p>
        <p><strong>Reasoning:</strong> ${params.reason}</p>
      </div>
    `;
  } else{
    console.log('should not answer so didnt add thing');
    return;
  }

  // Expand box on click
  // fact.onclick = function() {
  //   let detail = fact.querySelector(".fact-detail");
  //   if (detail.style.display === "none") {
  //     detail.style.display = "block";
  //     fact.style.height = "auto";
  //   } else {
  //     detail.style.display = "none";
  //     fact.style.height = "80px"; // Set a fixed height or adjust as needed
  //   }
  // };

  factElement.appendChild(fact);
}
