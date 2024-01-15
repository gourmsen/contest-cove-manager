// functions
import { ContestObjectiveSchema } from '../interfaces/contest-objective-schema';
import { database } from './database';

export const standings = {
    calculatePoints(contestId: string, attendeeId: string, round: number) {
    
        // query entries and objectives for points
        let attendeePoints;
        if (round) {
            attendeePoints = database.queryDatabase(
                `SELECT sum(a.objectiveValue * b.value) AS points
                FROM contest_attendee_entries AS a
                INNER JOIN contest_objectives AS b
                ON a.contestId = b.contestId
                AND a.objectiveName = b.name
                WHERE a.contestId = ?
                AND a.attendeeId = ?
                AND a.round = ?`,
                [contestId, attendeeId, round]);
        } else {
            attendeePoints = database.queryDatabase(
                `SELECT sum(a.objectiveValue * b.value) AS points
                FROM contest_attendee_entries AS a
                INNER JOIN contest_objectives AS b
                ON a.contestId = b.contestId
                AND a.objectiveName = b.name
                WHERE a.contestId = ?
                AND a.attendeeId = ?`,
                [contestId, attendeeId]);
        }

        // check points
        if (attendeePoints[0].points) {
            return attendeePoints[0].points;
        } else {
            return 0;
        }
    },
    calculatePlace(contestId: string, attendeeId: string, round: number) {

        // query entries and objectives for points
        let attendeePoints;
        if (round) {
            attendeePoints = database.queryDatabase(
                `SELECT a.attendeeId, sum(a.objectiveValue * b.value) AS points
                FROM contest_attendee_entries AS a
                INNER JOIN contest_objectives AS b
                ON a.contestId = b.contestId
                AND a.objectiveName = b.name
                WHERE a.contestId = ?
                AND a.round = ?
                GROUP BY a.attendeeId
                ORDER BY points DESC`,
                [contestId, round]);
        } else {
            attendeePoints = database.queryDatabase(
                `SELECT a.attendeeId, sum(a.objectiveValue * b.value) AS points
                FROM contest_attendee_entries AS a
                INNER JOIN contest_objectives AS b
                ON a.contestId = b.contestId
                AND a.objectiveName = b.name
                WHERE a.contestId = ?
                GROUP BY a.attendeeId
                ORDER BY points DESC`,
                [contestId]);
        }

        // prepare attendees
        let attendees: any[] = [];
        for (let i = 0; i < attendeePoints.length; i++) {
            let attendeeData = {
                id: attendeePoints[i].attendeeId,
                points: attendeePoints[i].points
            }

            attendees.push(attendeeData);
        }

        // calculate place
        let currentPlace = 0;
        for (let i = 0; i < attendees.length; i++) {

            // set current place
            if (i) {
                if (attendees[i].points < attendees[i - 1].points) {
                    currentPlace = i + 1;
                }
            } else {
                currentPlace = i + 1;
            }

            // pick out attendee
            if (attendees[i].id === attendeeId) {
                return currentPlace;
            }
        }

        // return the latest next place when attendee not found
        return currentPlace + 1;
    },
    calculateObjectiveValues(contestId: string, attendeeId: string, round: number) {

        // query entries for objective values
        let attendeeObjectiveValues;
        if (round) {
            attendeeObjectiveValues = database.queryDatabase(
                `SELECT objectiveName, sum(objectiveValue) AS overallValue
                FROM contest_attendee_entries
                WHERE contestId = ?
                AND attendeeId = ?
                AND round = ?
                GROUP BY objectiveName
                ORDER BY id`,
                [contestId, attendeeId, round]);
        } else {
            attendeeObjectiveValues = database.queryDatabase(
                `SELECT objectiveName, sum(objectiveValue) AS overallValue
                FROM contest_attendee_entries
                WHERE contestId = ?
                AND attendeeId = ?
                GROUP BY objectiveName
                ORDER BY id`,
                [contestId, attendeeId]);
        }

        // fill objective array
        let objectiveValueList: ContestObjectiveSchema[] = new Array<ContestObjectiveSchema>();
        for (let i = 0; i < attendeeObjectiveValues.length; i++) {
            let objectiveData: ContestObjectiveSchema = {
                name: attendeeObjectiveValues[i].objectiveName,
                value: attendeeObjectiveValues[i].overallValue
            }

            objectiveValueList.push(objectiveData);
        }

        return objectiveValueList;
    }
}