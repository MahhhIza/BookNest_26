
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import database from './config/database';

// Carrega as variáveis de ambiente da raiz do projeto.
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Permite receber e interpretar requisições JSON.
app.use(express.json());

// Verifica se a API está funcionando.
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API do BookNest está funcionando!'
  });
});

// Verifica a conexão com o MySQL.
app.get('/health/db', async (_req, res) => {
  try {
    await database.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      message: 'Conexão com o MySQL realizada com sucesso!'
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const dbError = error as Error & {
        code?: string;
        errno?: number;
      };

      console.error('Falha na conexão com o MySQL:', {
        code: dbError.code,
        errno: dbError.errno,
        message: dbError.message
      });
    } else {
      console.error('Falha na conexão com o MySQL: erro desconhecido.');
    }

    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: 'Não foi possível conectar ao banco de dados.'
    });
  }
});

// Inicializa o servidor.
app.listen(PORT, () => {
  console.log(`BookNest API disponível na porta ${PORT}`);
});
