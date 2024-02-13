// functions
import { database } from "../functions/database";
import { teams } from "../functions/teams";

// interfaces
import { ContestTeamSchema } from "../interfaces/contest-team-schema";
import { ContestTeamsNewRequest } from "../interfaces/contest-teams-new-request";
import { ContestTeamsNewResponse } from "../interfaces/contest-teams-new-response";

// module variables
let status: number;
let payload: any;

export const contestTeamsNew = {
    generateContestTeams(contestTeamsNewRequest: ContestTeamsNewRequest) {
        // query contests for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestTeamsNewRequest.contestId]
        );

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist.",
            };

            return [status, payload];
        }

        // query attendees for contestId
        let attendees = database.queryDatabase(
            `SELECT *
            FROM contest_attendees
            WHERE contestId = ?`,
            [contestTeamsNewRequest.contestId]
        );

        // check existing attendees
        if (!attendees.length) {
            status = 404;
            payload = {
                message: "No attendees found.",
            };

            return [status, payload];
        }

        // sum up requested team sizes
        let sizeSum = 0;
        for (let i = 0; i < contestTeamsNewRequest.teamSizes.length; i++) {
            sizeSum += contestTeamsNewRequest.teamSizes[i];
        }

        // check correct team size
        if (sizeSum !== attendees.length) {
            status = 409;
            payload = {
                message: "Team sizes don't match attendee count.",
            };

            return [status, payload];
        }

        // generate teams
        let contestTeams: ContestTeamSchema[] = teams.generateTeams(
            contestTeamsNewRequest.contestId,
            contestTeamsNewRequest.teamSizes,
            contests[0].maxRound
        );

        // prepare response
        let contestTeamsNewResponse: ContestTeamsNewResponse = {
            message: "Teams have been generated.",
            data: {
                contestId: contestTeamsNewRequest.contestId,
                teams: contestTeams,
            },
        };

        status = 200;
        payload = contestTeamsNewResponse;

        return [status, payload];
    },
};
