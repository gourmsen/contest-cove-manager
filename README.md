# Contest Cove Manager

A back-end REST-API for the contest-cove web interface.

## Endpoints

### POST

| URL        | Request              | Response              | Input            | Output                                              | Description                                                                           |
| ---------- | -------------------- | --------------------- | ---------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/sign-up` | `sign-up-request.ts` | `sign-up-response.ts` | `userId`, `name` | `userId`, `name`, `privateTokenId`, `publicTokenId` | Accepts a `userId` and `name`, creates an user.                                       |
| `/sign-in` | `sign-in-request.ts` | `sign-in-response.ts` | `tokenId`        | `tokenId`, `userId`, `name`                         | Accepts a `privateTokenId` and checks whether the `publicTokenId` is in the database. |