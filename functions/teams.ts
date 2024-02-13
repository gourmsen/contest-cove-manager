// functions
import { database } from "./database";

// interfaces
import { ContestTeamSchema } from "../interfaces/contest-team-schema";

export const teams = {
    generateTeams(contestId: string, teamSizes: number[], maxRound: number): ContestTeamSchema[] {
        // delete current teams
        database.writeDatabase(
            `DELETE FROM contest_attendee_teams
            WHERE contestId = ?`,
            [contestId]
        );

        // query attendees for contestId
        let attendees = database.queryDatabase(
            `SELECT *
            FROM contest_attendees
            WHERE contestId = ?`,
            [contestId]
        );

        // fill available attendees
        let availableAttendees: string[] = [];
        for (let i = 0; i < attendees.length; i++) {
            availableAttendees.push(attendees[i].attendeeId);
        }

        return [];
    },
    combinations(attendees: string[], size: number): string[][] {
        let combinations: string[][] = [];

        let generateCombinations = (current: string[], start: number) => {
            if (current.length === size) {
                combinations.push(current.slice());
                return;
            }

            for (let i = start; i < attendees.length; i++) {
                current.push(attendees[i]);
                generateCombinations(current, i + 1);
                current.pop();
            }
        };

        generateCombinations([], 0);

        return combinations;
    },
};
