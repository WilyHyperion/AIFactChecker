import { Transform } from "stream"; import ytdl from '@distube/ytdl-core';
const cookies = [
    { name: "SID", value: "g.a000nQjqtmjxZX_4pfmVpbXwjPFaIkD5gRLQGJ0Vw1V-4bCpmjCnn8LgM7VvfnhvGCrjhq_G8wACgYKASQSARESFQHGX2Mi18R6o7fPLsaFscZAsIfBJRoVAUF8yKqBFmy_N0z2y58f2IdX66Ky0076" }, { name: " APISID", value: "1Kc4I5olrh8xfHAa/AHxWuSmUlLUCmdw88" }, { name: " SAPISID", value: "NiAxxw6teIlZ7eWx/AdgB5XTjFJylLlagF" }, { name: " __Secure-1PAPISID", value: "NiAxxw6teIlZ7eWx/AdgB5XTjFJylLlagF" }, { name: " __Secure-3PAPISID", value: "NiAxxw6teIlZ7eWx/AdgB5XTjFJylLlagF" }, { name: " PREF", value: "f6" }, { name: " SIDCC", value: "AKEyXzUoMpRI6_iKjFNtCLSxUbwTvcIWBdN5PRs33xV8XpZExhB9sOX0YDldzGARfAzFJI2t" }
]
const agent = ytdl.createAgent(cookies, {});
async function handleView(vidID: string, res: any) {
    try {
        console.log(vidID);
        ytdl("http://www.youtube.com/watch?v=aqz-KE-bpKQ", { agent }).pipe(require("fs").createWriteStream("video.mp4"));
        return new Response("lego fortnite");
        const response = new Response(video.mp3, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mp3',
            },
        });
        return response
    } catch (error) {
        console.error('Error generating content:', error);
    }
}

async function getResponse(query: string) {
    console.log("getting response")
    require("fs").unlink("video.aac", () => { });
    let p = new Promise((resolve, reject) => {
         let vid = (ytdl("https://www.youtube.com/watch?v=J38Yq85ZoyY",  { filter: 'audio', quality: "highest"}).pipe(require("fs").createWriteStream("video.aac")))
        vid.on("close", () => {
            resolve("")
        });
    });
    await p
    let buffer = await require("fs").promises.readFile("video.aac");
    let r = new Response(buffer);
    r.headers.set("Content-Type", "audio/aac");
    console.log(r )
    console.log("done")
    return r;
}
export default {
    handleView: handleView,
    getResponse: getResponse
}

//SrGENEXocJU