export interface ContestLeaveResponse {
    message: string;
    data: {
        contestId: string;
        attendeeId: string;
    }
}
