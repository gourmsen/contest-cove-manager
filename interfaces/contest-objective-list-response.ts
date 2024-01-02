import { ContestObjectiveSchema } from "./contest-objective-schema";

export interface ContestObjectiveListResponse {
    message: string;
    data: {
        contestId: string;
        objectives: ContestObjectiveSchema[]
    }
}
