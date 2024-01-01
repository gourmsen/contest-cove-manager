// interfaces
import { ContestAttendeeSchema } from "../interfaces/contest-attendee-schema";
import { ContestAttendeeListResponse } from "../interfaces/contest-attendee-list-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    listContestAttendees(contestId: string) {
        let db = require('../functions/database.ts');
        let standings = require('../functions/standings.ts');

        // query contest for contestId
        let contests = db.queryDatabase(
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
        let contestAttendeeList: ContestAttendeeSchema[] = new Array<ContestAttendeeSchema>();

        for (let i = 0; i < contestAttendees.length; i++) {

            // query users for attendeeId
            let users = db.queryDatabase(
                `SELECT *
                FROM users
                WHERE userId = ?`,
                [contestAttendees[i].attendeeId]);
            
            // fill name for attendeeId
            let name = "";
            if (users.length) {
                name = users[0].name
            }

            // calculate points for each round
            let points: number[] = [];
            for (let j = 0; j < contests[0].currentRound + 1; j++) {
                points[j] = Math.round(standings.calculatePoints(contestId, contestAttendees[i].attendeeId, j) * 100 / 100)
            }

            // calculate places for each round
            let places: number[] = [];
            for (let j = 0; j < contests[0].currentRound + 1; j++) {
                places[j] = standings.calculatePlace(contestId, contestAttendees[i].attendeeId, j)
            }

            let contestAttendee: ContestAttendeeSchema = {
                attendeeId: contestAttendees[i].attendeeId,
                name: name,
                points: points,
                places: places
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