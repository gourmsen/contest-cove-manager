// functions
import { database } from "../functions/database";

// interfaces
import { ContestTimerSchema } from "../interfaces/contest-timer-schema";
import { ContestTimerNewRequest } from "../interfaces/contest-timer-new-request";
import { ContestTimerNewResponse } from "../interfaces/contest-timer-new-response";

// module variables
let status: number;
let payload: any;

export const contestTimerNew = {
    createTimer(contestTimerNewRequest: ContestTimerNewRequest) {
        // query contests for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestTimerNewRequest.contestId]
        );

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest not found.",
            };

            return [status, payload];
        }

        // delete current timer
        database.writeDatabase(
            `DELETE FROM contest_round_timers
            WHERE contestId = ?
            AND round = ?`,
            [contestTimerNewRequest.contestId, contestTimerNewRequest.round]
        );

        // write new timer to database
        let modtime = database.getModtime();

        database.writeDatabase(
            `INSERT INTO contest_round_timers (
                contestId,
                round,
                start,
                duration,
                modtime
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                contestTimerNewRequest.contestId,
                contestTimerNewRequest.round,
                modtime,
                contestTimerNewRequest.duration,
                modtime,
            ]
        );

        // prepare round timer
        let timer: ContestTimerSchema = {
            contestId: contestTimerNewRequest.contestId,
            round: contestTimerNewRequest.round,
            start: modtime,
            duration: contestTimerNewRequest.duration,
        };

        // prepare response
        let contestTimerNewResponse: ContestTimerNewResponse = {
            message: "Timer created.",
            data: timer,
        };

        status = 200;
        payload = contestTimerNewResponse;

        return [status, payload];
    },
};
