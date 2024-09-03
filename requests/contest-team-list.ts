// functions
import { database } from "../functions/database";
import { teams } from "../functions/teams";
import { standings } from "../functions/standings";

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

        // get teams for each round
        let rounds: any[] = [];
        for (let i = 0; i < contests[0].currentRound; i++) {
            let contestTeams: ContestTeamSchema[] = teams.listTeams(contestId, i + 1);

            // calculate points for each team
            for (let j = 0; j < contestTeams.length; j++) {
                let points = 0;

                for (let k = 0; k < contestTeams[j].attendees.length; k++) {
                    points += standings.calculatePoints(contestId, contestTeams[j].attendees[k].attendeeId, i + 1);
                }

                contestTeams[j].points = points;
            }

            // prepare round data
            let roundData = {
                round: i + 1,
                teams: contestTeams,
            };

            rounds.push(roundData);
        }

        // prepare response
        let contestTeamListResponse: ContestTeamListResponse = {
            message: "Teams have been retrieved.",
            data: {
                contestId: contestId,
                rounds: rounds,
            },
        };

        status = 200;
        payload = contestTeamListResponse;

        return [status, payload];
    },
};
