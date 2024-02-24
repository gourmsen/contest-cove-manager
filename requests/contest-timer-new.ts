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

        // prepare round timer
        let timer: ContestTimerSchema = {
            contestId: contestTimerNewRequest.contestId,
            round: contestTimerNewRequest.round,
            start: "", // TODO: fill with start time
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
