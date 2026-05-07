// server.js
import app from './routes.js';

const port = 3000;

// Configurar o EJS como motor de templates
app.set('view engine', 'ejs');

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});