const mysql = require('mysql');

const connection = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'fleetstorm',
	database: process.env.DB_DATABASE || 'fleetstorm',
	password: process.env.DB_PASSWORD || ''
});

connection.connect();

module.exports = connection;
