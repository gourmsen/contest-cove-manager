// functions
import { database } from '../functions/database';

// interfaces
import { ContestObjectiveSchema } from "../interfaces/contest-objective-schema";
import { ContestEntrySchema } from "../interfaces/contest-entry-schema";
import { ContestEntryListResponse } from "../interfaces/contest-entry-list-response";

// module variables
let status: number;
let payload: any;

export const contestEntryList = {
    listContestEntries(contestId: string) {

        // query contest for contestId
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

        // query contest_attendee_entries for contestId
        let contestEntriesDistinct = database.queryDatabase(
            `SELECT DISTINCT contestId, attendeeId, entryId, round 
            FROM contest_attendee_entries
            WHERE contestId = ?
            ORDER BY id DESC`,
            [contestId]);

        if (!contestEntriesDistinct.length) {
            status = 404;
            payload = {
                message: "No contest entries exist."
            }

            return [status, payload];
        }

        // fill contest attendee entry list with entries
        let contestEntryList: ContestEntrySchema[] = new Array<ContestEntrySchema>();
        let contestObjectiveList: ContestObjectiveSchema[] = new Array<ContestObjectiveSchema>();
        for (let i = 0; i < contestEntriesDistinct.length; i++) {

            // query users for attendeeId
            let users = database.queryDatabase(
                `SELECT *
                FROM users
                WHERE userId = ?`,
                [contestEntriesDistinct[i].attendeeId]
            );

            // fill name
            let attendeeName = "";
            if (users.length) {
                attendeeName = users[0].name;
            }

            // query contest_attendee_entries for entryId
            let contestEntries = database.queryDatabase(
                `SELECT *
                FROM contest_attendee_entries
                WHERE entryId = ?
                ORDER BY id`,
                [contestEntriesDistinct[i].entryId]);
            
            // fill time
            let time = "";
            time = contestEntries[0].modtime.substring(11, 16);

            // prepare values
            for (let j = 0; j < contestEntries.length; j++) {

                // fill objective
                let contestObjective: ContestObjectiveSchema = {
                    name: contestEntries[j].objectiveName,
                    value: contestEntries[j].objectiveValue
                }

                contestObjectiveList.push(contestObjective);
            }

            let contestEntry: ContestEntrySchema = {
                contestId: contestEntriesDistinct[i].contestId,
                attendeeId: contestEntriesDistinct[i].attendeeId,
                attendeeName: attendeeName,
                entryId: contestEntriesDistinct[i].entryId,
                round: contestEntriesDistinct[i].round,
                modtime: time,
                values: contestObjectiveList
            }

            contestEntryList.push(contestEntry);

            contestObjectiveList = [];
        }

        // prepare response
        let contestEntryListResponse: ContestEntryListResponse = {
            message: "Entry list retrieved.",
            data: {
                entries: contestEntryList
            }
        }

        status = 200;
        payload = contestEntryListResponse;

        return [status, payload];
    }
}