const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
	host: DB_HOST,
	port: DB_PORT,
	database: DB_NAME,
	user: DB_USER,
	password: DB_PASS,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

module.exports = { mysql, pool }