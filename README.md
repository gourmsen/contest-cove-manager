# Contest Cove Manager

A back-end REST-API for the contest-cove web interface.

## Endpoints

| URL                       | REST     | Request                   | Response                             | Input                       | Output                                                                                             | Description                             |
| ------------------------- | -------- | ------------------------- | ------------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `/contest-list`           | `GET`    |                           | `contest-list-response.ts`           |                             | `contestId`, `creationDate`, `state`, `authorId`, `currentRound`, `maxRoundCount`, `rated`, `type` | Lists all contests.                     |
| `/contest-detail`         | `GET`    |                           | `contest-detail-response.ts`         | `:contestId`                | `contestId`, `creationDate`, `state`, `authorId`, `currentRound`, `maxRoundCount`, `rated`, `type` | Returns contest details.                |
| `/contest-attendee-list`  | `GET`    |                           | `contest-attendee-list-response.ts`  | `:contestId`                | `contestId`, `attendeeId`, `name`, `points`, `places`                                              | Lists all attendees of a contest.       |
| `/contest-objective-list` | `GET`    |                           | `contest-objective-list-response.ts` | `:contestId`                | `contestId`, `name`, `value`                                                                       | Lists all objectives of a contest.      |
| `/sign-up`                | `POST`   | `sign-up-request.ts`      | `sign-up-response.ts`                | `userId`, `name`            | `userId`, `name`, `privateTokenId`, `publicTokenId`                                                | Creates an entry in the user database.  |
| `/sign-in`                | `POST`   | `sign-in-request.ts`      | `sign-in-response.ts`                | `tokenId`                   | `tokenId`, `userId`, `name`                                                                        | Verifies an entry in the user database. |
| `/contest-join`           | `POST`   | `contest-join-request.ts` | `contest-join-response.ts`           | `contestId`, `attendeeId`   | `contestId`, `attendeeId`                                                                          | Joins a contest.                        |
| `/contest-leave`          | `DELETE` |                           | `contest-leave-response.ts`          | `:contestId`, `:attendeeId` | `contestId`, `attendeeId`                                                                          | Leaves a contest                        |