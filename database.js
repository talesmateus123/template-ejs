import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

database.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro.message);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

export default database;