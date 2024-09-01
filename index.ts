import youtube from "./youtube";
import gemini  from "./gemini";
import Bun from "bun";
const server = Bun.serve({
    port:3000,
    async fetch(request, server) {
        let path = request.url.split("/").slice(3)
        console.log(path)
        if(path[0] == "test") {
            return new Response(Bun.file("index.html"));
        }
        if(path[0] == "statements"){
        }
        if(path[0] == "factcheck" && request.method == "POST"){
            let body = await request.json();
            return new Response(await gemini.getResponse( body.statement));
        }
        return new Response("lego fortnite");
    },
})


//https://super-meme-567qq96vwj9h7xqj-3000.app.github.dev/