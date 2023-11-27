export interface SignUpResponse {
    message: string
    data: {
        userId: string;
        name: string;
        privateTokenId: string;
        publicTokenId: string;
    }
}
