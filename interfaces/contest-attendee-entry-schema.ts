import { ContestObjectiveSchema } from "./contest-objective-schema";

export interface ContestAttendeeEntrySchema {
    contestId: string;
    attendeeId: string;
    attendeeName: string;
    entryId: string;
    round: number;
    modtime: string;
    values: ContestObjectiveSchema[];
}