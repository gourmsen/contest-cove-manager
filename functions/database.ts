import env from '../app';
import Database from 'better-sqlite3';

module.exports = {
    queryDatabase(sql: string, databaseData: Array<any>) {

        // open database
        let db = new Database(env.DB_PATH);

        // query records
        let records = db.prepare(sql).all(databaseData);

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
        let currentTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
        let options: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(currentTime)).replace(', ', ',');
    }
}