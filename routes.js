import express from "express";
const app = express();

// Rota da página inicial
app.get('/', (req, res) => {
    // Renderiza o arquivo views/index.ejs
    res.render('index', {
        titulo: 'Olá Mundo!',
    });
});

export default app;