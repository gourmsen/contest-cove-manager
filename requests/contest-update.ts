// interfaces
import { ContestSchema } from '../interfaces/contest-schema';
import { ContestUpdateRequest } from '../interfaces/contest-update-request';
import { ContestUpdateResponse } from '../interfaces/contest-update-response';

// module variables
let status: number;
let payload: any;

module.exports = {
    updateContest(contestUpdateRequest: ContestUpdateRequest) {
        let db = require('../functions/database.ts');

        // query contest for contestId
        let contests = db.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestUpdateRequest.contest.contestId]);

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist."
            }

            return [status, payload];
        }

        // update contest in table contests
        let modtime = db.getModtime();

        db.writeDatabase(
            `UPDATE contests
            SET state = ?,
            currentRound = ?,
            modtime = ?
            WHERE contestId = ?`,
            [contestUpdateRequest.contest.state,
            contestUpdateRequest.contest.currentRound,
            modtime,
            contestUpdateRequest.contest.contestId]);

        // prepare contest for response
        let contest: ContestSchema = contestUpdateRequest.contest;

        // prepare response
        let contestUpdateResponse: ContestUpdateResponse = {
            message: "Contest has been updated.",
            data: contest
        }

        status = 200;
        payload = contestUpdateResponse;

        return [status, payload];
    }
}