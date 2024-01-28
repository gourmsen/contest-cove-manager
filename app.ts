// basics
import dotenv from "dotenv";
import betterLogging from "better-logging";
import fs from "fs";
import { cleanEnv, port, str, bool } from "envalid";

// server
import express from "express";
import cors from "cors";

// http
import http from "http";
import https from "https";
import WebSocket from "ws";

// functions
import { database } from "./functions/database";

// requests (get)
import { contestList } from "./requests/contest-list";
import { contestDetail } from "./requests/contest-detail";
import { contestAttendeeList } from "./requests/contest-attendee-list";
import { contestObjectiveList } from "./requests/contest-objective-list";
import { contestAttendeeEntryList } from "./requests/contest-attendee-entry-list";
import { contestStatisticsList } from "./requests/contest-statistics-list";

// requests (post)
import { auth } from "./requests/auth";
import { contestNew } from "./requests/contest-new";
import { contestJoin } from "./requests/contest-join";
import { contestAttendeeEntryNew } from "./requests/contest-attendee-entry-new";
import { contestStatisticsRefresh } from "./requests/contest-statistics-refresh";

// requests (put)
import { contestUpdate } from "./requests/contest-update";

// requests (delete)
import { contestDelete } from "./requests/contest-delete";
import { contestLeave } from "./requests/contest-leave";

// create environment variables conforming to TypeScript
dotenv.config();
const env = cleanEnv(process.env, {
    PORT: port(),
    DB_PATH: str(),
    PROD: bool(),
    KEY_PATH: str(),
    CERT_PATH: str(),
});
export default env;

// create express app
const app = express();

// create server depending on environment
let server;
if (env.PROD) {
    // define private key and certificate file for SSL
    let credentials = {
        key: fs.readFileSync(env.KEY_PATH, "utf8"),
        cert: fs.readFileSync(env.CERT_PATH, "utf8"),
    };

    // create https server (production)
    server = https.createServer(credentials, app);
} else {
    // create http server (development)
    server = http.createServer(app);
}

// create web-socket
const wss = new WebSocket.Server({ server });

// create web-socket client
let clients: Set<WebSocket> = new Set();

wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);
    ws.send(JSON.stringify({ event: "socket-connect" }));

    ws.on("close", () => {
        clients.delete(ws);
        ws.send(JSON.stringify({ event: "socket-disconnect" }));
    });
});

// handle CORS for Angular
app.use(cors());

// parse json body
app.use(express.json());

// setup better logging
betterLogging(console);

database.initialize();

/*
<----- GET REQUESTS ----->
*/

// default
app.get("/", (req, res) => {});

// alive
app.get("/alive", (req, res) => {
    // respond with status code and payload
    res.status(200);
    res.json({ status: "alive" });
});

// contest-list
app.get("/contest-list", (req, res) => {
    // list contests
    let response = contestList.listContests();

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-detail
app.get("/contest-detail/:contestId", (req, res) => {
    // view contest
    let response = contestDetail.viewContest(req.params.contestId);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-attendee-list
app.get("/contest-attendee-list/:contestId", (req, res) => {
    // list attendees
    let response = contestAttendeeList.listContestAttendees(
        req.params.contestId
    );

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-objective-list
app.get("/contest-objective-list/:contestId", (req, res) => {
    // list objectives
    let response = contestObjectiveList.listContestObjectives(
        req.params.contestId
    );

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-attendee-entry-list
app.get("/contest-attendee-entry-list/:contestId", (req, res) => {
    // list entries
    let response = contestAttendeeEntryList.listContestAttendeeEntries(
        req.params.contestId
    );

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-statistics-list
app.get("/contest-statistics-list", (req, res) => {
    // fill optional parameters
    let type: string =
        req.query.type !== undefined ? (req.query.type as string) : "";
    let contestId: string =
        req.query.contestId !== undefined
            ? (req.query.contestId as string)
            : "";
    let attendeeId: string =
        req.query.attendeeId !== undefined
            ? (req.query.attendeeId as string)
            : "";

    // list statistics
    let response = contestStatisticsList.listStatistics(
        type,
        contestId,
        attendeeId
    );

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

/*
<----- POST REQUESTS ----->
*/

// default
app.post("/", (req, res) => {});

// sign-up
app.post("/sign-up", (req, res) => {
    // attempt sign-up
    let response = auth.signUp(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// sign-in
app.post("/sign-in", (req, res) => {
    // attempt sign-in
    let response = auth.signIn(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-new
app.post("/contest-new", (req, res) => {
    // attempt creation
    let response = contestNew.createContest(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-join
app.post("/contest-join", (req, res) => {
    // attempt join
    let response = contestJoin.joinContest(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-attendee-entry-new
app.post("/contest-attendee-entry-new", (req, res) => {
    // log new entry
    let response = contestAttendeeEntryNew.logContestEntry(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);

    // notify web-socket clients about entry
    notifyAllClients("contest-attendee-entry-new");
});

// contest-statistics-refresh
app.post("/contest-statistics-refresh", (req, res) => {
    // attempt refresh
    let response = contestStatisticsRefresh.refreshContestStatistics(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

/*
<----- PUT REQUESTS ----->
*/

// contest-update
app.put("/contest-update", (req, res) => {
    // attempt update
    let response = contestUpdate.updateContest(req.body);

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);

    // notify web-socket clients about update
    notifyAllClients("contest-update");
});

/*
<----- DELETE REQUESTS ----->
*/

// contest-delete
app.delete("/contest-delete/:contestId/:userId", (req, res) => {
    // delete contest
    let response = contestDelete.deleteContest(
        req.params.contestId,
        req.params.userId
    );

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// contest-leave
app.delete("/contest-leave/:contestId/:userId", (req, res) => {
    // leave contest
    let response = contestLeave.leaveContest(
        req.params.contestId,
        req.params.userId
    );

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

// activate app and listen on port
server.listen(env.PORT, () => {
    console.log("Contest Cove Manager is listening on port " + env.PORT);
});

/*
<----- OTHER FUNCTIONS ----->
*/

function notifyAllClients(event: string) {
    // notify web-socket clients about entry
    for (let client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ event: event }));
        }
    }
}
