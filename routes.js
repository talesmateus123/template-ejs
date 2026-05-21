import express from "express";
import database from "./database.js";

const app = express();

// ROTAS

// Página inicial
app.get('/', async (req, res) => {
    res.render('index', { titulo: 'Bem-vindo ao EJS!' });
});

export default app;
