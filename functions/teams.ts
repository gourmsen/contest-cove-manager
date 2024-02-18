// functions
import { database } from "./database";

// interfaces
import { ContestTeamSchema } from "../interfaces/contest-team-schema";
import { ContestAttendeeSchema } from "../interfaces/contest-attendee-schema";

export const teams = {
    generateTeams(contestId: string, round: number, teamSizes: number[]): ContestTeamSchema[] {
        // delete current teams
        database.writeDatabase(
            `DELETE FROM contest_attendee_teams
            WHERE contestId = ?
            AND round = ?`,
            [contestId, round]
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

        // generate teams for each team size
        let teamCombinations: string[][] = [];
        for (let i = 0; i < teamSizes.length; i++) {
            // get combinations for current team size
            let sizeCombinations = this.combinations(availableAttendees, teamSizes[i]);

            // draft team and filter from available attendees
            let draftedTeam = Math.floor(Math.random() * sizeCombinations.length);
            teamCombinations.push(sizeCombinations[draftedTeam]);
            availableAttendees = availableAttendees.filter(
                (remainder) => !sizeCombinations[draftedTeam].includes(remainder)
            );
        }

        // write teams to database and prepare teams output
        let teams: ContestTeamSchema[] = [];
        for (let i = 0; i < teamCombinations.length; i++) {
            let teamAttendees: ContestAttendeeSchema[] = [];

            for (let j = 0; j < teamCombinations[i].length; j++) {
                let modtime = database.getModtime();

                // write team to database
                database.writeDatabase(
                    `INSERT INTO contest_attendee_teams (
                        contestId,
                        attendeeId,
                        teamId,
                        round,
                        modtime
                ) VALUES (?, ?, ?, ?, ?)`,
                    [contestId, teamCombinations[i][j], i + 1, round, modtime]
                );

                // get attendee name
                let users = database.queryDatabase(
                    `SELECT *
                    FROM users
                    WHERE userId = ?`,
                    [teamCombinations[i][j]]
                );

                // prepare attendee
                let attendee: ContestAttendeeSchema = {
                    attendeeId: users[0].userId,
                    name: users[0].name,
                };

                teamAttendees.push(attendee);
            }

            // prepare team
            let team: ContestTeamSchema = {
                attendees: teamAttendees,
            };

            teams.push(team);
        }

        return teams;
    },
    listTeams(contestId: string, round: number): ContestTeamSchema[] {
        // query contest_attendee_teams for contestId
        let teams = database.queryDatabase(
            `SELECT *
            FROM contest_attendee_teams
            WHERE contestId = ?
            AND round = ?
            ORDER BY teamId`,
            [contestId, round]
        );

        if (!teams.length) {
            return [];
        }

        // get maximum team number
        let maxTeamId: number = 0;
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].teamId > maxTeamId) {
                maxTeamId = teams[i].teamId;
            }
        }

        // fill teams
        let contestTeams: ContestTeamSchema[] = [];
        for (let i = 0; i < maxTeamId; i++) {
            let attendees: ContestAttendeeSchema[] = [];

            // get attendees
            for (let j = 0; j < teams.length; j++) {
                if (teams[j].teamId === i + 1) {
                    // get attendee name
                    let users = database.queryDatabase(
                        `SELECT *
                        FROM users
                        WHERE userId = ?`,
                        [teams[j].attendeeId]
                    );

                    // prepare attendee
                    let attendee: ContestAttendeeSchema = {
                        attendeeId: users[0].userId,
                        name: users[0].name,
                    };

                    attendees.push(attendee);
                }
            }

            // prepare team
            let contestTeam: ContestTeamSchema = {
                attendees: attendees,
            };

            contestTeams.push(contestTeam);
        }

        return contestTeams;
    },
    updateTeams(contestId: string, round: number, teams: ContestTeamSchema[]) {
        // delete current teams
        database.writeDatabase(
            `DELETE FROM contest_attendee_teams
            WHERE contestId = ?
            AND round = ?`,
            [contestId, round]
        );

        // write each team to the database
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams[i].attendees.length; j++) {
                // write team to database
                let modtime = database.getModtime();

                database.writeDatabase(
                    `INSERT INTO contest_attendee_teams (
                        contestId,
                        attendeeId,
                        teamId,
                        round,
                        modtime
                    ) VALUES (?, ?, ?, ?, ?)`,
                    [contestId, teams[i].attendees[j].attendeeId, i + 1, round, modtime]
                );
            }
        }
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
