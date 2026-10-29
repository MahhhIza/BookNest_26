import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Permite que a API receba e interprete requisições JSON.
app.use(express.json());

// Rota inicial de verificação da API.
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API do BookNest está funcionando!'
  });
});

// Inicializa o servidor.
app.listen(PORT, () => {
  console.log(`BookNest API disponível na porta ${PORT}`);
});