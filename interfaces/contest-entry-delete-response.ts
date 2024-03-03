import { ContestEntrySchema } from "./contest-entry-schema";

export interface ContestEntryDeleteResponse {
    message: string;
    data: {
        entryId: string;
    };
}
