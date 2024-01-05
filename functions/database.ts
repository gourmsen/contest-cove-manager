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