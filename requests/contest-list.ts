// functions
import { database } from '../functions/database';

// interfaces
import { ContestSchema } from "../interfaces/contest-schema";
import { ContestListResponse } from "../interfaces/contest-list-response";

// module variables
let status: number;
let payload: any;

export const contestList = {
    listContests() {

        // query contests
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            ORDER BY creationDate DESC`,
            []);

        // check existing contests
        if (!contests.length) {
            status = 404;
            payload = {
                message: "No contests found."
            }

            return [status, payload];
        }

        // fill contest list with contests
        let contestList:ContestSchema[] = new Array<ContestSchema>();

        for (let i = 0; i < contests.length; i++) {
            // check for statistics
            let contestAttendeeStatistics = database.queryDatabase(
                `SELECT *
                FROM contest_attendee_statistics
                WHERE contestId = ?`,
                [contests[i].contestId]);

            let hasStatistics = false;
            if (contestAttendeeStatistics.length) {
                hasStatistics = true;
            }

            let contest: ContestSchema = {
                contestId: contests[i].contestId,
                creationDate: contests[i].creationDate,
                state: contests[i].state,
                authorId: contests[i].authorId,
                currentRound: contests[i].currentRound,
                maxRoundCount: contests[i].maxRoundCount,
                rated: contests[i].rated,
                type: contests[i].type,
                hasStatistics: hasStatistics
            }

            contestList.push(contest);
        }

        // prepare response
        let contestListResponse: ContestListResponse = {
            message: "Contest list retrieved.",
            data: {
                contests: contestList
            }
        }

        status = 200;
        payload = contestListResponse;

        return [status, payload];
    }
}