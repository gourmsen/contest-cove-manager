// interfaces
import { ContestLeaveResponse } from "../interfaces/contest-leave-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    leaveContest(contestId: string, attendeeId: string) {
        let db = require('../functions/database.ts');

        // query attendees for attendeeId
        let attendees = db.queryDatabase(
            `SELECT attendeeId
            FROM contest_attendees
            WHERE contestId = ?
            AND attendeeId = ?`,
            [contestId,
            attendeeId]);
        
        // check existing attendee
        if (!attendees.length) {
            status = 404;
            payload = {
                message: "User is not attending."
            }

            return [status, payload];
        }

        // delete attendee from table contest_attendees
        db.writeDatabase(
            `DELETE FROM contest_attendees
            WHERE contestId = ?
            AND attendeeId = ?`,
            [contestId,
            attendeeId]);

        // prepare response
        let contestLeaveResponse: ContestLeaveResponse = {
            message: "User has left the contest.",
            data: {
                contestId: contestId,
                attendeeId: attendeeId
            }
        }

        status = 200;
        payload = contestLeaveResponse;

        return [status, payload];
    }
}