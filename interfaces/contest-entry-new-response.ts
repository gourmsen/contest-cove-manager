import { ContestEntrySchema } from "./contest-entry-schema";

export interface ContestEntryNewResponse {
    message: string;
    data: ContestEntrySchema
}
