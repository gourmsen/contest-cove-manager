import crypto from 'crypto';

// interfaces
import { ContestObjectiveSchema } from '../interfaces/contest-objective-schema';
import { ContestAttendeeEntrySchema } from '../interfaces/contest-attendee-entry-schema';
import { ContestAttendeeEntryNewRequest } from "../interfaces/contest-attendee-entry-new-request";
import { ContestAttendeeEntryNewResponse } from "../interfaces/contest-attendee-entry-new-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    logContestEntry(contestAttendeeEntryNewRequest: ContestAttendeeEntryNewRequest) {
        let db = require('../functions/database.ts');

        // query contests for contestId
        let contests = db.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestAttendeeEntryNewRequest.contestId]);
        
        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist."
            }

            return [status, payload];
        }

        // query contest_objectives for contestId
        let contestObjectives = db.queryDatabase(
            `SELECT *
            FROM contest_objectives
            WHERE contestId = ?
            ORDER BY id`,
            [contestAttendeeEntryNewRequest.contestId]);
        
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
            let contestAttendeeEntries = db.queryDatabase(
                `SELECT *
                FROM contest_attendee_entries
                WHERE entryId = ?`,
                [newEntryId]);

            // check existing entryId
            if (!contestAttendeeEntries.length) {
                entryId = newEntryId;
                
                break;
            }
        }

        // write new entry to table contest_attendee_entries
        let contestObjectiveList: ContestObjectiveSchema[] = new Array<ContestObjectiveSchema>();
        for (let i = 0; i < contestObjectives.length; i++) {
            let modtime = db.getModtime();

            db.writeDatabase(
                `INSERT INTO contest_attendee_entries (
                    contestId,
                    attendeeId,
                    entryId,
                    objectiveName,
                    objectiveValue,
                    round,
                    modtime
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [contestAttendeeEntryNewRequest.contestId,
                contestAttendeeEntryNewRequest.attendeeId,
                entryId,
                contestObjectives[i].name,
                contestAttendeeEntryNewRequest.values[i],
                contests[0].currentRound,
                modtime]);
            
            // prepare objective list for response
            let contestObjective: ContestObjectiveSchema = {
                name: contestObjectives[i].name,
                value: contestAttendeeEntryNewRequest.values[i]
            }

            contestObjectiveList.push(contestObjective);
        }

        // prepare entry for response
        let contestAttendeeEntry: ContestAttendeeEntrySchema = {
            contestId: contestAttendeeEntryNewRequest.contestId,
            attendeeId: contestAttendeeEntryNewRequest.attendeeId,
            entryId: entryId,
            round: contests[0].currentRound,
            values: contestObjectiveList
        }

        // prepare response
        let contestAttendeeEntryNewResponse: ContestAttendeeEntryNewResponse = {
            message: "Entry has been logged.",
            data: contestAttendeeEntry
        }

        status = 200;
        payload = contestAttendeeEntryNewResponse;

        return [status, payload];
    }
}