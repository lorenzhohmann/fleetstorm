const mysql = require('mysql');

const connection = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'battleship',
	database: process.env.DB_DATABASE || 'battleship',
	password: process.env.DB_PASSWORD || ''
});

connection.connect();

module.exports = connection;
