// interfaces
import { ContestJoinRequest } from "../interfaces/contest-join-request";
import { ContestJoinResponse } from "../interfaces/contest-join-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    joinContest(contestJoinRequest: ContestJoinRequest) {
        let db = require('../functions/database.ts');

        // query attendees for attendeeId
        let attendees = db.queryDatabase(
            `SELECT attendeeId
            FROM contest_attendees
            WHERE contestId = ?
            AND attendeeId = ?`,
            [contestJoinRequest.contestId,
            contestJoinRequest.attendeeId]);
        
        // check existing attendee
        if (attendees.length) {
            status = 409;
            payload = {
                message: "User is already attending."
            }

            return [status, payload];
        }

        // write new attendee to table contest_attendees
        let modtime = db.getModtime();

        db.writeDatabase(
            `INSERT INTO contest_attendees (
                contestId,
                attendeeId,
                modtime
            ) VALUES (?, ?, ?)`,
            [contestJoinRequest.contestId,
            contestJoinRequest.attendeeId,
            modtime]);

        // prepare response
        let contestJoinResponse: ContestJoinResponse = {
            message: "User has joined the contest.",
            data: {
                contestId: contestJoinRequest.contestId,
                attendeeId: contestJoinRequest.attendeeId
            }
        }

        status = 200;
        payload = contestJoinResponse;

        return [status, payload];
    }
}