const sqlite3 = require('sqlite3').verbose();

const database = {
    getDb: function getDb() {
        let db = new sqlite3.Database('db/esc.db', (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the scooter database.');
        });

        return db;
    }
};

module.exports = database;
