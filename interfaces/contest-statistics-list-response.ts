import { ContestStatisticsSchema } from "./contest-statistics-schema";

export interface ContestStatisticsListResponse {
    message: string;
    data: ContestStatisticsSchema[];
}
