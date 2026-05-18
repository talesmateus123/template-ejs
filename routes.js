import express from "express";
import database from "./database.js";
const app = express();

// Middleware para parsear dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
    ** ** Exemplo de consulta ao banco de dados e renderização com EJS ** **
    const resultados = await database.promise().query('SELECT * FROM `livro`');
    res.render('index', { 
        titulo: 'Meus Livros!',
        livros: resultados[0] 
    });
*/

// Rota da página inicial
app.get('/', async (req, res) => {
    // Renderiza o arquivo views/index.ejs
    res.render('index', { titulo: 'Bem-vindo ao EJS!' });
});

export default app;
