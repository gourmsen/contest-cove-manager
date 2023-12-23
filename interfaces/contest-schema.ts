export interface ContestSchema {
    contestId: string;
    creationDate: string;
    state: string;
    authorId: string;
    currentRound: number;
    maxRoundCount: number;
    rated: boolean;
    type: string;
}