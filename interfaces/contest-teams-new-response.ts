import { ContestTeamSchema } from "./contest-team-schema";

export interface ContestTeamsNewResponse {
    message: string;
    data: {
        contestId: string;
        teams: ContestTeamSchema[];
    };
}
