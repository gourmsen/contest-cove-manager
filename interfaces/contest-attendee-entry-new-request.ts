import { ContestObjectiveSchema } from "./contest-objective-schema";

export interface ContestAttendeeEntryNewRequest {
    contestId: string;
    attendeeId: string;
    values: number[];
}
