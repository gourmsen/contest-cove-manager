import express from 'express';
import dotenv from 'dotenv';

import { cleanEnv, port, str } from 'envalid';

// create express app
const app = express();

// create environment variables conforming to TypeScript
dotenv.config();
const env = cleanEnv(process.env, {
    PORT: port(),
    DB_PATH: str()
});
export default env;

// handle CORS for Angular
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
               "http://localhost:4200");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse json body
app.use(express.json());

/*
<----- GET REQUESTS ----->
*/

// default
app.get("/", (req, res) => { });

app.get("/contest-list", (req, res) => {
    let contestList = require('./requests/contest-list.ts');

    // list contests
    let response = contestList.listContests();

    // respond with status code and payload
    res.status(response[0]);
    res.json(response[1]);
});

app.get("/contest-detail/:contestId", (req, res) => {
    let contestDetail = require('./requests/contest-detail.ts');

    // view contest
    let response = contestDetail.viewContest(req.params.contestId);

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

// activate app and listen on port
app.listen(env.PORT, () => {
    console.log("Contest Cove Manager is listening on port " + env.PORT);
});