import { ContestAttendeeEntrySchema } from "./contest-attendee-entry-schema";

export interface ContestAttendeeEntryListResponse {
    message: string;
    data: {
        entries: ContestAttendeeEntrySchema[]
    }
}
