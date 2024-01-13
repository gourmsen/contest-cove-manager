// functions
import { database } from '../functions/database';

// interfaces
import { ContestObjectiveSchema } from '../interfaces/contest-objective-schema';
import { ContestObjectiveListResponse } from "../interfaces/contest-objective-list-response";

// module variables
let status: number;
let payload: any;

export const contestObjectiveList = {
    listContestObjectives(contestId: string) {

        // query objectives for contestId
        let contestObjectives = database.queryDatabase(
            `SELECT *
            FROM contest_objectives
            WHERE contestId = ?
            ORDER BY id`,
            [contestId]);

        // check existing objectives
        if (!contestObjectives.length) {
            status = 404;
            payload = {
                message: "No contest objectives found."
            }

            return [status, payload];
        }

        // fill contest objective list with objectives
        let contestObjectiveList:ContestObjectiveSchema[] = new Array<ContestObjectiveSchema>();

        for (let i = 0; i < contestObjectives.length; i++) {
            let contestObjective: ContestObjectiveSchema = {
                name: contestObjectives[i].name,
                value: contestObjectives[i].value
            }

            contestObjectiveList.push(contestObjective);
        }

        // prepare response
        let contestObjectiveListResponse: ContestObjectiveListResponse = {
            message: "Contest objective list retrieved.",
            data: {
                contestId: contestId,
                objectives: contestObjectiveList
            }
        }

        status = 200;
        payload = contestObjectiveListResponse;

        return [status, payload];
    }
}
