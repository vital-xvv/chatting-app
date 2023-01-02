const dotenv = require("dotenv");
const mysql = require("mysql2");

dotenv.config();

const pool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

let sql = "SELECT * FROM users";

pool.execute(sql, (error, result) => {
  if (error) throw error;
  console.log(result);
});

module.exports = pool.promise();
