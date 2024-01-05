import { ContestObjectiveSchema } from "./contest-objective-schema";

export interface ContestNewRequest {
    authorId: string;
    maxRoundCount: number;
    rated: boolean;
    type: string;
    objectives: ContestObjectiveSchema[]
}
