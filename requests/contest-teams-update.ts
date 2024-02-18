// functions
import { database } from "../functions/database";
import { teams } from "../functions/teams";

// interfaces
import { ContestTeamSchema } from "../interfaces/contest-team-schema";
import { ContestTeamsUpdateRequest } from "../interfaces/contest-teams-update-request";
import { ContestTeamsUpdateResponse } from "../interfaces/contest-teams-update-response";

// module variables
let status: number;
let payload: any;

export const contestTeamsUpdate = {
    updateContestTeams(contestTeamsUpdateRequest: ContestTeamsUpdateRequest) {
        // query contests for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestTeamsUpdateRequest.contestId]
        );

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist.",
            };

            return [status, payload];
        }

        // prepare response
        let contestTeamsUpdateResponse: ContestTeamsUpdateResponse = {
            message: "Teams have been updated.",
            data: {
                contestId: contestTeamsUpdateRequest.contestId,
                teams: [], // TODO: fill teams
            },
        };

        status = 200;
        payload = contestTeamsUpdateResponse;

        return [status, payload];
    },
};
