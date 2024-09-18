# AIFactChecker
This is a project for an Advanced CS assigment, and is unlikely to be updated. 
Also, the repo contains a lot of junk files - ie the output files, which should be ignored 

If you still want to run regardless


# Running
## Backend
create an .env with your gemini api key
```
API_GEMINI = ...
```
Next, run `bun install` then `bun index.ts`

## Frontend
By default, the extenstion connects to a server that is only up when we use it. You'll have to directly modify `extension/FactChecker/main.js` to connect to your own
change the value of `host` declared on line 37 (at the time of writing at least) to your own server
Then, just install the files as a temp extension, open a youtube video, and click activate on the extension popup
