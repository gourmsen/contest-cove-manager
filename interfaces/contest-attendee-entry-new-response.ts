import { ContestAttendeeEntrySchema } from "./contest-attendee-entry-schema";

export interface ContestAttendeeEntryNewResponse {
    message: string;
    data: ContestAttendeeEntrySchema
}
