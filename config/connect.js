//bring mysql2 into connection
const mysql = require('mysql2')

//bring our .env info into connections
require('dotenv').config();

//imports the fs built in package
const fs = require('fs')

//login into database using the login info in our .env file
const db = mysql.createConnection({
  host: 'localhost',
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306
}
);

//make connection to db
db.connect(err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connection Successful!');
    // createTable();
    // addSeeds();
  }
});

//create db?
function createTable(path) {
  fs.readFile('./db/schema.sql', 'utf8', (err, sql) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Success')
        }
      })
    }
  })
}

module.exports = db;
