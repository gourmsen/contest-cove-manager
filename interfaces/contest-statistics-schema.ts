import { ContestAttendeeSchema } from "./contest-attendee-schema";

export interface ContestStatisticsSchema {
    attendee: ContestAttendeeSchema;
    medals: number[];
    points: number[];
    objectives: {
        name: string;
        values: number[];
    }[];
}
