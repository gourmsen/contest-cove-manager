// interfaces
import { ContestAttendeeSchema } from "../interfaces/contest-attendee-schema";
import { ContestAttendeeListResponse } from "../interfaces/contest-attendee-list-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    listContestAttendees(contestId: string) {
        let db = require('../functions/database.ts');

        // query attendees for contestId
        let contestAttendees = db.queryDatabase(
            `SELECT *
            FROM contest_attendees
            WHERE contestId = ?
            ORDER BY modtime ASC`,
            [contestId]);

        // check existing attendees
        if (!contestAttendees.length) {
            status = 404;
            payload = {
                message: "No attendees found."
            }

            return [status, payload];
        }

        // fill contest attendee list with attendees
        let contestAttendeeList:ContestAttendeeSchema[] = new Array<ContestAttendeeSchema>();

        for (let i = 0; i < contestAttendees.length; i++) {
            let contestAttendee: ContestAttendeeSchema = {
                attendeeId: contestAttendees[i].attendeeId
            }

            contestAttendeeList.push(contestAttendee);
        }

        // prepare response
        let contestAttendeeListResponse: ContestAttendeeListResponse = {
            message: "Attendee list retrieved.",
            data: {
                contestId: contestAttendees[0].contestId,
                attendees: contestAttendeeList
            }
        }

        status = 200;
        payload = contestAttendeeListResponse;

        return [status, payload];
    }
}