// functions
import { database } from "../functions/database";

// interfaces
import { ContestEntryDeleteResponse } from "../interfaces/contest-entry-delete-response";

// module variables
let status: number;
let payload: any;

export const contestEntryDelete = {
    deleteContestEntry(entryId: string) {
        // query contest_attendee_entries for entryId
        let contestEntries = database.queryDatabase(
            `SELECT *
            FROM contest_attendee_entries
            WHERE entryId = ?`,
            [entryId]
        );

        // check existing entry
        if (!contestEntries.length) {
            status = 404;
            payload = {
                message: "Entry doesn't exist.",
            };

            return [status, payload];
        }

        // delete entry from table contest_attendee_entries
        database.writeDatabase(
            `DELETE FROM contest_attendee_entries
            WHERE entryId = ?`,
            [entryId]
        );

        // prepare response
        let contestEntryDeleteResponse: ContestEntryDeleteResponse = {
            message: "Entry has been deleted.",
            data: {
                entryId: entryId,
            },
        };

        status = 200;
        payload = contestEntryDeleteResponse;

        return [status, payload];
    },
};
