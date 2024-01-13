import env from '../app';
import Database from 'better-sqlite3';

export const database = {
    initialize() {

        // connect to database
        let db = new Database(env.DB_PATH);

        // create table "users"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                userId TEXT NOT NULL UNIQUE,
                tokenId TEXT NOT NULL,
                name TEXT NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        // create table "contests"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS contests (
                id INTEGER PRIMARY KEY,
                contestId TEXT NOT NULL UNIQUE,
                creationDate TEXT NOT NULL,
                state TEXT NOT NULL,
                authorId TEXT NOT NULL,
                currentRound INTEGER NOT NULL,
                maxRoundCount INTEGER NOT NULL,
                rated INTEGER NOT NULL,
                type TEXT NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        // create table "contest_objectives"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS contest_objectives (
                id INTEGER PRIMARY KEY,
                contestId TEXT NOT NULL,
                name TEXT NOT NULL,
                value REAL NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        // create table "contest_attendees"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS contest_attendees (
                id INTEGER PRIMARY KEY,
                contestId TEXT NOT NULL,
                attendeeId TEXT NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        // create table "contest_attendee_entries"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS contest_attendee_entries (
                id INTEGER PRIMARY KEY,
                contestId TEXT NOT NULL,
                attendeeId TEXT NOT NULL,
                entryId TEXT NOT NULL,
                objectiveName TEXT NOT NULL,
                objectiveValue REAL NOT NULL,
                round INTEGER NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        // create table "contest_attendee_teams"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS contest_attendee_teams (
                id INTEGER PRIMARY KEY,
                contestId TEXT NOT NULL,
                attendeeId TEXT NOT NULL,
                teamId INTEGER NOT NULL,
                round INTEGER NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        // create table "contest_attendee_statistics"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS contest_attendee_statistics (
                id INTEGER PRIMARY KEY,
                contestId TEXT NOT NULL,
                attendeeId TEXT NOT NULL,
                round INTEGER NOT NULL,
                points REAL NOT NULL,
                place INTEGER NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        // create table "contest_attendee_objective_statistics"
        db.prepare(
            `CREATE TABLE IF NOT EXISTS contest_attendee_objective_statistics (
                id INTEGER PRIMARY KEY,
                contestId TEXT NOT NULL,
                attendeeId TEXT NOT NULL,
                round INTEGER NOT NULL,
                objectiveName TEXT NOT NULL,
                objectiveValue REAL NOT NULL,
                modtime TEXT NOT NULL)`
        ).run();

        db.close();
    },
    queryDatabase(sql: string, databaseData: Array<any>) {

        // open database
        let db = new Database(env.DB_PATH);

        // query records
        let records: any[] = db.prepare(sql).all(databaseData);

        // close database
        db.close();

        return records;
    },
    writeDatabase(sql: string, databaseData: Array<any>) {

        // open database
        let db = new Database(env.DB_PATH);

        // write records
        db.prepare(sql).run(databaseData);

        // close database
        db.close();
    },
    getModtime() {

        // get time
        let currentTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
        let options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        // format in US locale
        let formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(currentTime));

        // filter single components
        let [datePart, timePart] = formattedDate.split(', ');
        let [month, day, year] = datePart.split('/');

        // construct modtime
        let isoString = `${year}-${month}-${day},${timePart}`;

        return isoString;
    }
}