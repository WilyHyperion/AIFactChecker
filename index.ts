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
      let chunk = JSON.parse(msg as any).data;
      let statements = gemini.splitByStatement(chunk);
       statements.then((s) => {
        for (let statement of s) {
        gemini.getResponse(statement).then((response) => {
          console.log(JSON.parse(response).value);
          ws.send(
            JSON.stringify({
              data: JSON.parse(response).value,
              fact: statement,
            })
          );
        });
        }
    });
    },
  },
});

//https://super-meme-567qq96vwj9h7xqj-3000.app.github.dev/
