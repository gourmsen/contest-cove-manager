import { ContestSchema } from "./contest-schema";
import { ContestObjectiveSchema } from "./contest-objective-schema";

export interface ContestNewResponse {
    message: string,
    data: {
        contest: ContestSchema,
        objectives: ContestObjectiveSchema[]
    }
}
