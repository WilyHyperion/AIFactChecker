import youtube from "./youtube";
import gemini from "./gemini";
import Bun from "bun";

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
    if (path[0] == "statements") {
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
