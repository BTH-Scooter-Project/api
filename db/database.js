const sqlite3 = require('sqlite3').verbose();

const database = {
    getDb: function getDb() {
        console.log("hejhe!");
        let db = new sqlite3.Database('./emmas.db', (err) => {
          if (err) {
            console.error(err.message);
          }
          console.log('Connected to the emmas database.');
        });

        console.log(db);

        return db;
    }
};

module.exports = database;
