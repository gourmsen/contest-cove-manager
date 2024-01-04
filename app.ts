import express from 'express';
import dotenv from 'dotenv';
import betterLogging from 'better-logging';
import http from 'http';
import WebSocket from 'ws';
import { cleanEnv, port, str } from 'envalid';

// create express app and web-socket
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// create environment variables conforming to TypeScript
dotenv.config();
const env = cleanEnv(process.env, {
    PORT: port(),
    DB_PATH: str()
});
export default env;

// create web-socket client
let clients: Set<WebSocket> = new Set();

wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);
    ws.send(JSON.stringify({event: "socket-connect"}));

    ws.on("close", () => {
        clients.delete(ws);
        ws.send(JSON.stringify({event: "socket-disconnect"}));
    })
});

// handle CORS for Angular
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
               "http://localhost:4200");
    res.header("Access-Control-Allow-Methods",
               "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse json body
app.use(express.json());

// setup better logging
betterLogging(console);

/*
<----- GET REQUESTS ----->
*/

// default
app.get("/", (req, res) => { });

// contest-list
app.get("/contest-list", (req, res) => {
    let contestList = require('./requests/contest-list.ts');

    // list contests
    let response = contestList.listContests();

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-detail
app.get("/contest-detail/:contestId", (req, res) => {
    let contestDetail = require('./requests/contest-detail.ts');

    // view contest
    let response = contestDetail.viewContest(req.params.contestId);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-attendee-list
app.get("/contest-attendee-list/:contestId", (req, res) => {
    let contestAttendeeList = require('./requests/contest-attendee-list.ts');

    // list attendees
    let response = contestAttendeeList.listContestAttendees(req.params.contestId);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-objective-list
app.get("/contest-objective-list/:contestId", (req, res) => {
    let contestObjectiveList = require('./requests/contest-objective-list.ts');

    // list objectives
    let response = contestObjectiveList.listContestObjectives(req.params.contestId);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-attendee-entry-list
app.get("/contest-attendee-entry-list/:contestId", (req, res) => {
    let contestAttendeeEntryList = require('./requests/contest-attendee-entry-list.ts');

    // list entries
    let response = contestAttendeeEntryList.listContestAttendeeEntries(req.params.contestId);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

/*
<----- POST REQUESTS ----->
*/

// default
app.post("/", (req, res) => { });

// sign-up
app.post("/sign-up", (req, res) => {
    let auth = require('./requests/auth.ts');

    // attempt sign-up
    let response = auth.signUp(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// sign-in
app.post("/sign-in", (req, res) => {
    let auth = require('./requests/auth.ts');

    // attempt sign-in
    let response = auth.signIn(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-join
app.post("/contest-join", (req, res) => {
    let contestJoin = require('./requests/contest-join.ts');

    // attempt join
    let response = contestJoin.joinContest(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-attendee-entry-new
app.post("/contest-attendee-entry-new", (req, res) => {
    let contestAttendeeEntryNew = require('./requests/contest-attendee-entry-new.ts');

    // log new entry
    let response = contestAttendeeEntryNew.logContestEntry(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);

    // notify web-socket clients about entry
    for (let client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({event: "contest-attendee-entry-new"}));
        }
    }
});

/*
<----- DELETE REQUESTS ----->
*/

// contest-leave
app.delete("/contest-leave/:contestId/:userId", (req, res) => {
    let contestLeave = require('./requests/contest-leave.ts');

    // leave contest
    let response = contestLeave.leaveContest(req.params.contestId, req.params.userId);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// activate app and listen on port
server.listen(env.PORT, () => {
    console.log("Contest Cove Manager is listening on port " + env.PORT);
});