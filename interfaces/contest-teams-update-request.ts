import { ContestTeamSchema } from "./contest-team-schema";

export interface ContestTeamsUpdateRequest {
    contestId: string;
    round: number;
    teams: ContestTeamSchema[];
}
