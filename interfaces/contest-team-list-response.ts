import { ContestTeamSchema } from "./contest-team-schema";

export interface ContestTeamListResponse {
    message: string;
    data: {
        contestId: string;
        rounds: {
            round: number;
            teams: ContestTeamSchema[];
        }[];
    };
}
