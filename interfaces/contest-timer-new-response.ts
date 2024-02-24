import { ContestTimerSchema } from "./contest-timer-schema";

export interface ContestTimerNewResponse {
    message: string;
    data: ContestTimerSchema;
}
