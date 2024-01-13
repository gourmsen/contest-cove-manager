module.exports = {
    calculatePoints(contestId: string, attendeeId: string, round: number) {
        let db = require('../functions/database.ts');
    
        // query entries and objectives for points
        let attendeePoints;
        if (round) {
            attendeePoints = db.queryDatabase(
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
            attendeePoints = db.queryDatabase(
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
            return Math.round(attendeePoints[0].points * 100 / 100);
        } else {
            return 0;
        }
    },
    calculatePlace(contestId: string, attendeeId: string, round: number) {
        let db = require('../functions/database.ts');

        // query attendees for contestId
        let contestAttendees = db.queryDatabase(
            `SELECT *
            FROM contest_attendees
            WHERE contestId = ?`,
            [contestId]
        );

        // query entries and objectives for points
        let attendeePoints;
        if (round) {
            attendeePoints = db.queryDatabase(
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
            attendeePoints = db.queryDatabase(
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
                points: Math.round(attendeePoints[i].points * 100 / 100)
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

        // return attendee count when no place found
        return contestAttendees.length;
    }
}