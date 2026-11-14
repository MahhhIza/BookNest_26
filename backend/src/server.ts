
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import database from './config/database';
import userRoutes from './modules/users/routes/UserRoutes';
import authRoutes from './modules/auth/routes/AuthRoutes';
import autorRoutes from './modules/autores/routes/AutorRoutes';
import seedInitialUsers from './database/seeds/initialUsers';

// Carrega as variáveis de ambiente da raiz do projeto.
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Permite receber e interpretar requisições JSON.
app.use(express.json());

// Configura as rotas da API.
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', autorRoutes);

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

// Inicializa o servidor e executa o seed quando habilitado.
async function startServer(): Promise<void> {
  try {
    if (process.env.SEED_INITIAL_USERS === 'true') {
      // Confirma que o banco está acessível antes do seed.
      await database.query('SELECT 1');

      // Cadastra as contas iniciais, se necessário.
      await seedInitialUsers();
    }

    app.listen(PORT, () => {
      console.log(`BookNest API disponível na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Não foi possível inicializar o servidor:', error);
    process.exit(1);
  }
}

startServer();
