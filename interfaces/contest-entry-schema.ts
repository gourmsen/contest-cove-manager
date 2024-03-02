import { ContestObjectiveSchema } from "./contest-objective-schema";

export interface ContestEntrySchema {
    contestId: string;
    attendeeId: string;
    attendeeName: string;
    entryId: string;
    round: number;
    modtime: string;
    values: ContestObjectiveSchema[];
}