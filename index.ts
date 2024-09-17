import youtube from "./youtube";
import gemini from "./gemini";
import Bun from "bun";
import { appendFile } from "node:fs/promises";
import { unlinkSync } from "node:fs";
const factfile = await Bun.file('data.json').json();
let index = 507; 
let output = await Bun.file('output.json').json();
console.log(factfile.claims.length)
const server = Bun.serve({
  port: 3000,
  async fetch(request, server) {
    if (server.upgrade(request)) {
      return new Response(null, { status: 101 });
    }
    let path = request.url.split("/").slice(3);
    console.log(path);
    if (path[0] == "test") {
      return new Response(Bun.file("index.html"));
    }
    if (path[0] == "eval") {
      return new Response(Bun.file("factcheck.html"))
    }
    if(path[0]  == "getFact") {
      do{
        index++
      }
      while(factfile.claims[index -1].validity.includes("should"));
      console.log(factfile.claims[index -1])
      return new Response(JSON.stringify(factfile.claims[index -1]))
    }
    if(path[0] == "verify") {
      let body = await request.json();
      output.push(body)
      console.log('running')
      Bun.write("output.json", JSON.stringify(output))
      Bun.write("lastindex", index + '')
      return new Response("ok")
    }
    if (path[0] == "factcheck" && request.method == "POST") {
      let body = await request.json();
      return new Response(await gemini.getResponse(body.statement));
    }
    if (path[0] == "youtube") {
      return await youtube.getResponse("");
    }
    return new Response("lego fortnite");
  },
  websocket: {
    message(ws, msg) {
      let data = JSON.parse(msg as any)
      let title = data.title
      let chunk = data.data;
      console.log(title);
      console.log(title)
      gemini.getResponseBulk(chunk, title).then((p) => {
      ws.send(p)
      })
    },
  },
  


});



console.log("Server running on port 3000");
//https://super-meme-567qq96vwj9h7xqj-3000.app.github.dev/