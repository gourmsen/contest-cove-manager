import { ContestAttendeeSchema } from "./contest-attendee-schema";

export interface ContestAttendeeListResponse {
    message: string;
    data: {
        contestId: string;
        attendees: ContestAttendeeSchema[]
    }
}
