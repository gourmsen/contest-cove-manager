export interface SignInResponse {
    message: string;
    data: {
        tokenId: string;
        userId: string;
        name: string;
    }
}
