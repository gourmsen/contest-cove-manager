import { ContestTimerSchema } from "./contest-timer-schema";

export interface ContestTimerDetailResponse {
    message: string;
    data: ContestTimerSchema;
}
