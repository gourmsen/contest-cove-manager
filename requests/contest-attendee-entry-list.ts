// interfaces
import { ContestObjectiveSchema } from "../interfaces/contest-objective-schema";
import { ContestAttendeeEntrySchema } from "../interfaces/contest-attendee-entry-schema";
import { ContestAttendeeEntryListResponse } from "../interfaces/contest-attendee-entry-list-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    listContestAttendeeEntries(contestId: string) {
        let db = require('../functions/database.ts');

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

        // query contest_attendee_entries for contestId
        let contestAttendeeEntriesDistinct = db.queryDatabase(
            `SELECT DISTINCT contestId, attendeeId, entryId, round 
            FROM contest_attendee_entries
            WHERE contestId = ?
            ORDER BY id DESC`,
            [contestId]);

        if (!contestAttendeeEntriesDistinct.length) {
            status = 404;
            payload = {
                message: "No contest entries exist."
            }

            return [status, payload];
        }

        // fill contest attendee entry list with entries
        let contestAttendeeEntryList: ContestAttendeeEntrySchema[] = new Array<ContestAttendeeEntrySchema>();
        let contestObjectiveList: ContestObjectiveSchema[] = new Array<ContestObjectiveSchema>();
        for (let i = 0; i < contestAttendeeEntriesDistinct.length; i++) {

            // query users for attendeeId
            let users = db.queryDatabase(
                `SELECT *
                FROM users
                WHERE userId = ?`,
                [contestAttendeeEntriesDistinct[i].attendeeId]
            );

            // fill name
            let attendeeName = "";
            if (users.length) {
                attendeeName = users[0].name;
            }

            // query contest_attendee_entries for entryId
            let contestAttendeeEntries = db.queryDatabase(
                `SELECT *
                FROM contest_attendee_entries
                WHERE entryId = ?
                ORDER BY id`,
                [contestAttendeeEntriesDistinct[i].entryId]);
            
            // fill time
            let time = "";
            time = contestAttendeeEntries[0].modtime.substring(11, 16);

            // prepare values
            for (let j = 0; j < contestAttendeeEntries.length; j++) {

                // fill objective
                let contestObjective: ContestObjectiveSchema = {
                    name: contestAttendeeEntries[j].objectiveName,
                    value: contestAttendeeEntries[j].objectiveValue
                }

                contestObjectiveList.push(contestObjective);
            }

            let contestAttendeeEntry: ContestAttendeeEntrySchema = {
                contestId: contestAttendeeEntriesDistinct[i].contestId,
                attendeeId: contestAttendeeEntriesDistinct[i].attendeeId,
                attendeeName: attendeeName,
                entryId: contestAttendeeEntriesDistinct[i].entryId,
                round: contestAttendeeEntriesDistinct[i].round,
                modtime: time,
                values: contestObjectiveList
            }

            contestAttendeeEntryList.push(contestAttendeeEntry);

            contestObjectiveList = [];
        }

        // prepare response
        let contestAttendeeEntryListResponse: ContestAttendeeEntryListResponse = {
            message: "Entry list retrieved.",
            data: {
                entries: contestAttendeeEntryList
            }
        }

        status = 200;
        payload = contestAttendeeEntryListResponse;

        return [status, payload];
    }
}