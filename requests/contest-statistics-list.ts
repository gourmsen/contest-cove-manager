// functions
import { database } from "../functions/database";

// interfaces
import { ContestAttendeeSchema } from "../interfaces/contest-attendee-schema";
import { ContestStatisticsSchema } from "../interfaces/contest-statistics-schema";
import { ContestStatisticsListResponse } from "../interfaces/contest-statistics-list-response";

// module variables
let status: number;
let payload: any;

export const contestStatisticsList = {
    listStatistics(type: string, contestId: string, attendeeId: string) {
        let dbQuery: string;
        let dbParms: any[] = [];
        let dbOptions: { additionalQuery: string; additionalParms: any[] };

        // query statistics for attendees
        dbQuery = `SELECT DISTINCT a.attendeeId
            FROM contest_attendee_statistics AS a`;
        dbOptions = additionalQuery(type, contestId);

        dbQuery += dbOptions.additionalQuery;
        dbParms = [...dbOptions.additionalParms];

        // check for parameters
        if (attendeeId) {
            if (type || contestId) {
                dbQuery += "\nAND ";
            } else {
                dbQuery += "\nWHERE ";
            }

            dbQuery += "a.attendeeId = ?";
            dbParms.push(attendeeId);
        }

        let statisticsAttendees = database.queryDatabase(dbQuery, dbParms);

        let contestStatisticsList: ContestStatisticsSchema[] =
            new Array<ContestStatisticsSchema>();

        // output statistics for each attendee
        for (let i = 0; i < statisticsAttendees.length; i++) {
            let statisticsAttendee: ContestAttendeeSchema;
            let statisticsMedals: number[] = [];
            let statisticsPoints: number[] = [];
            let statisticsObjectiveList: {
                name: string;
                values: number[];
            }[] = [];

            /*
            <----- ATTENDEE INFORMATION ----->
            */

            // get attendee name
            let attendeeName = database.queryDatabase(
                "SELECT name FROM users WHERE userId = ?",
                [statisticsAttendees[i].attendeeId]
            );

            // fill attendee information
            if (attendeeName.length) {
                statisticsAttendee = {
                    attendeeId: statisticsAttendees[i].attendeeId,
                    name: attendeeName[0].name,
                };
            } else {
                statisticsAttendee = {
                    attendeeId: statisticsAttendees[i].attendeeId,
                    name: "",
                };
            }

            /*
            <----- MEDALS INFORMATION ----->
            */

            // get first, second and third medals
            for (let j = 0; j < 3; j++) {
                // query statistics for medals
                dbQuery = `SELECT count(*) AS medalCount
                    FROM contest_attendee_statistics AS a`;
                dbOptions = additionalQuery(type, contestId);

                dbQuery += dbOptions.additionalQuery;
                dbParms = [...dbOptions.additionalParms];

                // check for parameters
                if (type || contestId) {
                    dbQuery += "\nAND ";
                } else {
                    dbQuery += "\nWHERE ";
                }
                dbQuery += "a.attendeeId = ? AND a.round = ? AND a.place = ?";

                dbParms.push(statisticsAttendees[i].attendeeId, 0, j + 1);

                let medals = database.queryDatabase(dbQuery, dbParms);

                statisticsMedals.push(medals[0].medalCount);
            }

            /*
            <----- POINTS INFORMATION ----->
            */

            // get points for total, average and best
            for (let j = 0; j < 3; j++) {
                dbQuery = "SELECT ";

                switch (j) {
                    // get total
                    case 0:
                        dbQuery += "sum(a.points) ";
                        break;

                    // get average
                    case 1:
                        dbQuery += "avg(a.points) ";
                        break;

                    // get best
                    case 2:
                        dbQuery += "max(a.points) ";
                        break;
                }

                dbQuery += `AS pointCount
                    FROM contest_attendee_statistics AS a`;
                dbOptions = additionalQuery(type, contestId);

                dbQuery += dbOptions.additionalQuery;
                dbParms = [...dbOptions.additionalParms];

                // check for parameters
                if (type || contestId) {
                    dbQuery += "\nAND ";
                } else {
                    dbQuery += "\nWHERE ";
                }
                dbQuery += "a.attendeeId = ? AND a.round = ?";

                dbParms.push(statisticsAttendees[i].attendeeId, 0);

                let points = database.queryDatabase(dbQuery, dbParms);

                statisticsPoints.push(points[0].pointCount);
            }

            /*
            <----- OBJECTIVE INFORMATION ----->
            */

            // get objectives
            dbQuery = `SELECT DISTINCT objectiveName
                FROM contest_attendee_objective_statistics AS a`;
            dbOptions = additionalQuery(type, contestId);

            dbQuery += dbOptions.additionalQuery;
            dbParms = [...dbOptions.additionalParms];

            dbQuery += "\nORDER BY a.id ASC";

            let statisticsObjectives = database.queryDatabase(dbQuery, dbParms);

            // get values for each objective
            for (let j = 0; j < statisticsObjectives.length; j++) {
                let values: number[] = [];

                // get values for total, average and best
                for (let k = 0; k < 3; k++) {
                    dbQuery = "SELECT ";

                    switch (k) {
                        // get total
                        case 0:
                            dbQuery += "sum(a.objectiveValue)";
                            break;

                        // get average
                        case 1:
                            dbQuery += "avg(a.objectiveValue)";
                            break;

                        // get best
                        case 2:
                            dbQuery += "max(a.objectiveValue)";
                            break;
                    }

                    dbQuery += `AS valueCount
                        FROM contest_attendee_objective_statistics AS a`;
                    dbOptions = additionalQuery(type, contestId);

                    dbQuery += dbOptions.additionalQuery;
                    dbParms = [...dbOptions.additionalParms];

                    // check for parameters
                    if (type || contestId) {
                        dbQuery += "\nAND ";
                    } else {
                        dbQuery += "\nWHERE ";
                    }
                    dbQuery +=
                        "a.attendeeId = ? AND a.objectiveName = ? AND a.round = ?";

                    dbParms.push(
                        statisticsAttendees[i].attendeeId,
                        statisticsObjectives[j].objectiveName,
                        0
                    );

                    let objectiveValues = database.queryDatabase(
                        dbQuery,
                        dbParms
                    );

                    values.push(objectiveValues[0].valueCount);
                }

                let objectiveData = {
                    name: statisticsObjectives[j].objectiveName,
                    values: values,
                };

                statisticsObjectiveList.push(objectiveData);
            }

            let contestStatistics: ContestStatisticsSchema = {
                attendee: statisticsAttendee,
                medals: statisticsMedals,
                points: statisticsPoints,
                objectives: statisticsObjectiveList,
            };

            contestStatisticsList.push(contestStatistics);
        }

        // prepare response
        let contestStatisticsListResponse: ContestStatisticsListResponse = {
            message: "Statistics retrieved.",
            data: contestStatisticsList,
        };

        status = 200;
        payload = contestStatisticsListResponse;

        return [status, payload];
    },
};

function additionalQuery(type: string, contestId: string) {
    let additionalQuery: string = "";
    let additionalParms: any[] = [];

    if (type) {
        additionalQuery = `\nINNER JOIN contests AS b
            ON a.contestId = b.contestId
            WHERE b.type = ?`;
        additionalParms.push(type);
    }

    if (contestId) {
        if (type) {
            additionalQuery += "\nAND a.contestId = ?";
        } else {
            additionalQuery += "\nWHERE a.contestId = ?";
        }
        additionalParms.push(contestId);
    }

    return { additionalQuery, additionalParms };
}
