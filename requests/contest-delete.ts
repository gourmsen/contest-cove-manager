// functions
import { database } from '../functions/database';

// interfaces
import { ContestDeleteResponse } from "../interfaces/contest-delete-response";

// module variables
let status: number;
let payload: any;

export const contestDelete = {
    deleteContest(contestId: string, userId: string) {

        // query contests for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestId]);
        
        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist."
            }

            return [status, payload];
        }

        // check for authorId
        if(userId !== contests[0].authorId) {
            status = 401;
            payload = {
                message: "Not the author of this contest."
            }

            return [status, payload];
        }

        // delete attendee from table contests
        database.writeDatabase(
            `DELETE FROM contests
            WHERE contestId = ?`,
            [contestId]);

        // prepare response
        let contestDeleteResponse: ContestDeleteResponse = {
            message: "Contest has been deleted.",
            data: {
                contestId: contestId,
            }
        }

        status = 200;
        payload = contestDeleteResponse;

        return [status, payload];
    }
}