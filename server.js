// server.js
import dotenv from 'dotenv';
import app from './routes.js';

dotenv.config();

const port = process.env.PORT || 3000;


// Configurar o EJS como motor de templates
app.set('view engine', 'ejs');

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});