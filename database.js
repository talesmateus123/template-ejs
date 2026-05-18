import mysql from 'mysql2';

const database = mysql.createConnection({
    host: 'localhost',
    user: 'biblioteca',
    password: '1234',
    database: 'biblioteca'
});

export default database;