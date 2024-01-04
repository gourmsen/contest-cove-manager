import { ContestObjectiveSchema } from "./contest-objective-schema";

export interface ContestAttendeeEntrySchema {
    contestId: string;
    attendeeId: string;
    entryId: string;
    round: number;
    values: ContestObjectiveSchema[];
}