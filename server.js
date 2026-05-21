import dotenv from 'dotenv';
import express from 'express';
import app from './routes.js';

dotenv.config();

const port = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static('public'));

// Middleware para parsear dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar o EJS como motor de templates
app.set('view engine', 'ejs');

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});