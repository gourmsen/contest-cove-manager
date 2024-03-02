// functions
import { database } from '../functions/database';
import crypto from 'crypto';

// interfaces
import { ContestObjectiveSchema } from '../interfaces/contest-objective-schema';
import { ContestEntrySchema } from '../interfaces/contest-entry-schema';
import { ContestEntryNewRequest } from "../interfaces/contest-entry-new-request";
import { ContestEntryNewResponse } from "../interfaces/contest-entry-new-response";

// module variables
let status: number;
let payload: any;

export const contestEntryNew = {
    logContestEntry(contestEntryNewRequest: ContestEntryNewRequest) {

        // query contests for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestEntryNewRequest.contestId]);
        
        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist."
            }

            return [status, payload];
        }

        // query users for attendeeId
        let users = database.queryDatabase(
            `SELECT *
            FROM users
            WHERE userId = ?`,
            [contestEntryNewRequest.attendeeId]
        );

        // fill name
        let attendeeName = "";
        if (users.length) {
            attendeeName = users[0].name;
        }

        // query contest_objectives for contestId
        let contestObjectives = database.queryDatabase(
            `SELECT *
            FROM contest_objectives
            WHERE contestId = ?
            ORDER BY id`,
            [contestEntryNewRequest.contestId]);
        
        // check existing objectives
        if (!contestObjectives.length) {
            status = 404;
            payload = {
                message: "No contest objectives found."
            }

            return [status, payload];
        }

        // generate entryId
        let entryId: string = "";
        while (true) {
            let newEntryId: string = crypto.randomBytes(5).toString("hex");

            // query entries for entryId
            let contestEntries = database.queryDatabase(
                `SELECT *
                FROM contest_attendee_entries
                WHERE entryId = ?`,
                [newEntryId]);

            // check existing entryId
            if (!contestEntries.length) {
                entryId = newEntryId;
                
                break;
            }
        }

        // write new entry to table contest_attendee_entries
        let time = "";
        let contestObjectiveList: ContestObjectiveSchema[] = new Array<ContestObjectiveSchema>();
        for (let i = 0; i < contestObjectives.length; i++) {
            let modtime = database.getModtime();

            // fill time
            time = modtime.substring(11, 16);
            
            database.writeDatabase(
                `INSERT INTO contest_attendee_entries (
                    contestId,
                    attendeeId,
                    entryId,
                    objectiveName,
                    objectiveValue,
                    round,
                    modtime
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [contestEntryNewRequest.contestId,
                contestEntryNewRequest.attendeeId,
                entryId,
                contestObjectives[i].name,
                contestEntryNewRequest.values[i],
                contests[0].currentRound,
                modtime]);
            
            // prepare objective list for response
            let contestObjective: ContestObjectiveSchema = {
                name: contestObjectives[i].name,
                value: contestEntryNewRequest.values[i]
            }

            contestObjectiveList.push(contestObjective);
        }

        // prepare entry for response
        let contestEntry: ContestEntrySchema = {
            contestId: contestEntryNewRequest.contestId,
            attendeeId: contestEntryNewRequest.attendeeId,
            attendeeName: attendeeName,
            entryId: entryId,
            round: contests[0].currentRound,
            modtime: time,
            values: contestObjectiveList
        }

        // prepare response
        let contestEntryNewResponse: ContestEntryNewResponse = {
            message: "Entry has been logged.",
            data: contestEntry
        }

        status = 200;
        payload = contestEntryNewResponse;

        return [status, payload];
    }
}