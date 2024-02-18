import { ContestTeamSchema } from "./contest-team-schema";

export interface ContestTeamsUpdateResponse {
    message: string;
    data: {
        contestId: string;
        teams: ContestTeamSchema[];
    };
}
