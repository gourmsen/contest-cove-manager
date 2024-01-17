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

        // delete contest from table contests
        database.writeDatabase(
            `DELETE FROM contests
            WHERE contestId = ?`,
            [contestId]);

        // delete objectives from table contest_objectives
        database.writeDatabase(
            `DELETE FROM contest_objectives
            WHERE contestId = ?`,
            [contestId]);

        // delete attendees from table contest_attendees
        database.writeDatabase(
            `DELETE FROM contest_attendees
            WHERE contestId = ?`,
            [contestId]);

        // delete teams from table contest_attendee_teams
        database.writeDatabase(
            `DELETE FROM contest_attendee_teams
            WHERE contestId = ?`,
            [contestId]);

        // delete entries from table contest_attendee_entries
        database.writeDatabase(
            `DELETE FROM contest_attendee_entries
            WHERE contestId = ?`,
            [contestId]);

        // delete statistics from table contest_attendee_statistics
        database.writeDatabase(
            `DELETE FROM contest_attendee_statistics
            WHERE contestId = ?`,
            [contestId]);

        // delete objective statistics from table contest_attendee_objective_statistics
        database.writeDatabase(
            `DELETE FROM contest_attendee_objective_statistics
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