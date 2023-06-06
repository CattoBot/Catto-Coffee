const mysql = require("mysql2");
const database = require("../settings/config");

let connection = mysql.createConnection({
  host: database.database.host,
  user: database.database.user,
  password: database.database.password,
  database: database.database.database,
});

module.exports = connection;