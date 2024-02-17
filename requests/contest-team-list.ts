// functions
import { database } from "../functions/database";
import { teams } from "../functions/teams";

// interfaces
import { ContestTeamSchema } from "../interfaces/contest-team-schema";
import { ContestTeamListResponse } from "../interfaces/contest-team-list-response";

// module variables
let status: number;
let payload: any;

export const contestTeamList = {
    listContestTeams(contestId: string) {
        // query contests for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestId]
        );

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist.",
            };

            return [status, payload];
        }

        let contestTeams: ContestTeamSchema[] = teams.listTeams(contestId, contests[0].currentRound);

        if (!contestTeams.length) {
            status = 404;
            payload = {
                message: "Contest doesn't have any teams.",
            };

            return [status, payload];
        }

        // prepare response
        let contestTeamListResponse: ContestTeamListResponse = {
            message: "Teams have been retrieved.",
            data: {
                contestId: contestId,
                teams: contestTeams,
            },
        };

        status = 200;
        payload = contestTeamListResponse;

        return [status, payload];
    },
};
