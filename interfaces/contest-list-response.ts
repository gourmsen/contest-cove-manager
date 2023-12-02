import { ContestSchema } from "./contest-schema";

export interface ContestListResponse {
    message: string;
    data: {
        contests: ContestSchema[]
    }
}
