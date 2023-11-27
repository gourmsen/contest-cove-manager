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
        return new Date().toJSON();
    }
}