export interface ContestSchema {
    contestId: string;
    creationDate: string;
    state: string;
    authorId: string;
    entryCount: number;
    currentRound: number;
    maxRoundCount: number;
    rated: boolean;
    type: string;
}