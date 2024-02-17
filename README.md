# Contest Cove Manager

A back-end REST-API for the contest-cove web interface.

## Endpoints

| URL                            | REST     | Description                        |
| ------------------------------ | -------- | ---------------------------------- |
| `/alive`                       | `GET`    | Responds with health check.        |
| `/contest-list`                | `GET`    | Lists all contests.                |
| `/contest-detail`              | `GET`    | Returns contest details.           |
| `/contest-attendee-list`       | `GET`    | Lists all attendees of a contest.  |
| `/contest-objective-list`      | `GET`    | Lists all objectives of a contest. |
| `/contest-attendee-entry-list` | `GET`    | Lists all entries of a contest.    |
| `/contest-statistics-list`     | `GET`    | Lists all contest statistics.      |
| `/contest-team-list`           | `GET`    | Lists all teams of a contest.      |
| `/sign-up`                     | `POST`   | Creates an user.                   |
| `/sign-in`                     | `POST`   | Verifies an user.                  |
| `/contest-new`                 | `POST`   | Creates a contest.                 |
| `/contest-join`                | `POST`   | Joins a contest.                   |
| `/contest-attendee-entry-new`  | `POST`   | Create a contest entry.            |
| `/contest-statistics-refresh`  | `POST`   | Refreshes contest statistics.      |
| `/contest-teams-new`           | `POST`   | Generates contest teams.           |
| `/contest-update`              | `PUT`    | Updates a contest.                 |
| `/contest-delete`              | `DELETE` | Deletes a contest.                 |
| `/contest-leave`               | `DELETE` | Leaves a contest.                  |