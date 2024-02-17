import { ContestAttendeeSchema } from "./contest-attendee-schema";

export interface ContestTeamSchema {
    attendees: ContestAttendeeSchema[];
}
