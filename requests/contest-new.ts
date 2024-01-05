import crypto from 'crypto';

// interfaces
import { ContestSchema } from '../interfaces/contest-schema';
import { ContestNewRequest } from "../interfaces/contest-new-request";
import { ContestNewResponse } from "../interfaces/contest-new-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    createContest(contestNewRequest: ContestNewRequest) {
        let db = require('../functions/database.ts');

        // generate contestId
        let contestId: string = "";
        while (true) {
            let newContestId: string = crypto.randomBytes(3).toString("hex");

            // query contests for contestId
            let contests = db.queryDatabase(
                `SELECT *
                FROM contests
                WHERE contestId = ?`,
                [newContestId]);

            // check existing contestId
            if (!contests.length) {
                contestId = newContestId;
                
                break;
            }
        }

        // write new contest to table contests
        let modtime = db.getModtime();
        let creationDate = modtime;
        let rated: number = contestNewRequest.rated ? 1 : 0;

        db.writeDatabase(
            `INSERT INTO contests (
                contestId,
                creationDate,
                state,
                authorId,
                currentRound,
                maxRoundCount,
                rated,
                type,
                modtime
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [contestId,
            creationDate,
            "Open",
            contestNewRequest.authorId,
            1,
            contestNewRequest.maxRoundCount,
            rated,
            contestNewRequest.type,
            modtime]);

        // write contest objectives to table contest_objectives
        for (let i = 0; i < contestNewRequest.objectives.length; i++) {
            let modtime = db.getModtime();

            db.writeDatabase(
                `INSERT INTO contest_objectives (
                    contestId,
                    name,
                    value,
                    modtime
                ) VALUES (?, ?, ?, ?)`,
                [contestId,
                contestNewRequest.objectives[i].name,
                contestNewRequest.objectives[i].value,
                modtime]
            )
        }

        // prepare contest for response
        let contest: ContestSchema = {
            contestId: contestId,
            creationDate: creationDate,
            state: "Open",
            authorId: contestNewRequest.authorId,
            currentRound: 1,
            maxRoundCount: contestNewRequest.maxRoundCount,
            rated: contestNewRequest.rated,
            type: contestNewRequest.type
        }

        // prepare response
        let contestNewResponse: ContestNewResponse = {
            message: "Contest has been created.",
            data: {
                contest: contest,
                objectives: contestNewRequest.objectives
            }
        }

        status = 200;
        payload = contestNewResponse;

        return [status, payload];
    }
}