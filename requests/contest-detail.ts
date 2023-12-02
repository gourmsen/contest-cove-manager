// interfaces
import { ContestSchema } from "../interfaces/contest-schema";
import { ContestDetailResponse } from "../interfaces/contest-detail-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    viewContest(contestId: string) {
        let db = require('../functions/database.ts');

        // query contests for contestId
        let contests = db.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestId]);

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest not found."
            }

            return [status, payload];
        }

        // fill contest details
        let contest: ContestSchema = {
            contestId: contests[0].contestId,
            creationDate: contests[0].creationDate,
            state: contests[0].state,
            authorId: contests[0].authorId,
            entryCount: contests[0].entryCount,
            currentRound: contests[0].currentRound,
            maxRoundCount: contests[0].maxRoundCount,
            rated: contests[0].rated,
            type: contests[0].type
        }

        // prepare response
        let contestDetailResponse: ContestDetailResponse = {
            message: "Contest details retrieved.",
            data: contest
        }

        status = 200;
        payload = contestDetailResponse;

        return [status, payload];
    }
}