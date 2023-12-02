import { ContestSchema } from "./contest-schema";

export interface ContestDetailResponse {
    message: string;
    data: ContestSchema;
}
