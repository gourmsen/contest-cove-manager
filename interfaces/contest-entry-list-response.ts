import { ContestEntrySchema } from "./contest-entry-schema";

export interface ContestEntryListResponse {
    message: string;
    data: {
        entries: ContestEntrySchema[]
    }
}
