// functions
import { database } from "../functions/database";

// interfaces
import { ContestTimerSchema } from "../interfaces/contest-timer-schema";
import { ContestTimerDetailResponse } from "../interfaces/contest-timer-detail-response";

// module variables
let status: number;
let payload: any;

export const contestTimerDetail = {
    viewTimer(contestId: string, round: number) {
        // query contests for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestId]
        );

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest not found.",
            };

            return [status, payload];
        }

        // get round timer
        let contestTimer = database.queryDatabase(
            `SELECT *
            FROM contest_round_timers
            WHERE contestId = ?
            AND round = ?`,
            [contestId, round]
        );

        // check existing timer
        if (!contestTimer.length) {
            status = 404;
            payload = {
                message: "Timer not found.",
            };

            return [status, payload];
        }

        // fill round timer details
        let timer: ContestTimerSchema = {
            contestId: contestId,
            round: round,
            start: contestTimer[0].start,
            duration: contestTimer[0].duration,
        };

        // prepare response
        let contestTimerDetailResponse: ContestTimerDetailResponse = {
            message: "Timer details retrieved.",
            data: timer,
        };

        status = 200;
        payload = contestTimerDetailResponse;

        return [status, payload];
    },
};
