// functions
import { database } from '../functions/database';
import { standings } from '../functions/standings';

// interfaces
import { ContestStatisticsRefreshRequest } from '../interfaces/contest-statistics-refresh-request';
import { ContestStatisticsRefreshResponse } from '../interfaces/contest-statistics-refresh-response';

// module variables
let status: number;
let payload: any;

export const contestStatisticsRefresh = {
    refreshContestStatistics(contestStatisticsRefreshRequest: ContestStatisticsRefreshRequest) {

        // query contest for contestId
        let contests = database.queryDatabase(
            `SELECT *
            FROM contests
            WHERE contestId = ?`,
            [contestStatisticsRefreshRequest.contestId]);

        // check existing contest
        if (!contests.length) {
            status = 404;
            payload = {
                message: "Contest doesn't exist."
            }

            return [status, payload];
        }

        // query attendees for contestId
        let contestAttendees = database.queryDatabase(
            `SELECT *
            FROM contest_attendees
            WHERE contestId = ?`,
            [contestStatisticsRefreshRequest.contestId]);
        
        // check existing attendees
        if (!contestAttendees.length) {
            status = 404;
            payload = {
                message: "No attendees found."
            }

            return [status, payload];
        }

        // delete statistics
        database.writeDatabase(
            `DELETE FROM contest_attendee_statistics
            WHERE contestId = ?`,
            [contestStatisticsRefreshRequest.contestId]);

        // delete objective statistics
        database.writeDatabase(
            `DELETE FROM contest_attendee_objective_statistics
            WHERE contestId = ?`,
            [contestStatisticsRefreshRequest.contestId]);

        // refresh statistics
        for (let i = 0; i < contestAttendees.length; i++) {

            // prepare points and places for each round
            for (let j = 0; j < contests[0].currentRound + 1; j++) {
                let points = standings.calculatePoints(contestStatisticsRefreshRequest.contestId, contestAttendees[i].attendeeId, j);
                let place = standings.calculatePlace(contestStatisticsRefreshRequest.contestId, contestAttendees[i].attendeeId, j);

                let modtime = database.getModtime();

                // write statistics to contest_attendee_statistics
                database.writeDatabase(
                    `INSERT INTO contest_attendee_statistics (
                        contestId,
                        attendeeId,
                        round,
                        points,
                        place,
                        modtime
                    ) VALUES (?, ?, ?, ?, ?, ?)`,
                    [contestStatisticsRefreshRequest.contestId,
                    contestAttendees[i].attendeeId,
                    j,
                    points,
                    place,
                    modtime]);
            }

            // prepare objectives for each round
            for (let j = 0; j < contests[0].currentRound + 1; j++) {
                let objectiveValues = standings.calculateObjectiveValues(contestStatisticsRefreshRequest.contestId, contestAttendees[i].attendeeId, j);

                // write statistics for each objective to contest_attendee_objective_statistics
                for (let k = 0; k < objectiveValues.length; k++) {
                    let modtime = database.getModtime();

                    database.writeDatabase(
                        `INSERT INTO contest_attendee_objective_statistics (
                            contestId,
                            attendeeId,
                            round,
                            objectiveName,
                            objectiveValue,
                            modtime
                        ) VALUES (?, ?, ?, ?, ?, ?)`,
                        [contestStatisticsRefreshRequest.contestId,
                        contestAttendees[i].attendeeId,
                        j,
                        objectiveValues[k].name,
                        objectiveValues[k].value,
                        modtime]);
                }
            }
        }

        // prepare response
        let contestStatisticsRefreshResponse: ContestStatisticsRefreshResponse = {
            message: "Statistics have been refreshed.",
            data: {
                contestId: contestStatisticsRefreshRequest.contestId,
            }
        }

        status = 200;
        payload = contestStatisticsRefreshResponse;

        return [status, payload];
    }
}