export interface SignUpResponse {
    message: string
    data: {
        userId: string;
        name: string;
        privateToken: string;
        publicToken: string;
    }
}
