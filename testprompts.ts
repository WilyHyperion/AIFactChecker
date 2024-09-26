import gemini from "./gemini";

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query : any) => new Promise((resolve) => rl.question(query, resolve));
let data = JSON.parse(await Bun.file("data.json" ).text());
let transcript = data.transcript;
let index;
do{
   index =  Math.round(Math.random() * transcript.length * 0.5 );
    console.log(`starting at ${index}(${index/transcript.length * 100}%)`)
} while(await prompt("continue?") != "y")
const chunksize = 300;
function prettyformat(p: {statement : string, validity: string, reason: string}[]){
    
    for(let i in p){
        console.log(`${p[i].validity == "false" ? "\x1b[41m" : p[i].validity == "true" ?"\x1b[42m": "\x1b[0m" }. \n${i}: ${p[i].statement}: ${p[i].validity} \n  \x1b[0m${p[i].reason}\n`)
    }
}
do{
    await gemini.getResponseBulk(transcript.slice(index - 50, index + chunksize), "chunk").then((p) => {
        prettyformat(JSON.parse(p));
    })
    index += chunksize;
}while(await prompt("continue?") != "n")