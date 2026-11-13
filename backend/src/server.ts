
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import database from './config/database';
import userRoutes from './modules/users/routes/UserRoutes';
import authRoutes from './modules/auth/routes/AuthRoutes';
import categoriaRoutes from './modules/categorias/routes/CategoriaRoutes';
import autorRoutes from './modules/autores/routes/AutorRoutes';
import livroRoutes from './modules/livros/routes/LivroRoutes';
import leituraRoutes from './modules/leituras/routes/LeituraRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const app = express();
const PORT = Number(process.env.PORT) || 3001;

if (!process.env.JWT_SECRET) {
  console.error('Defina a variável JWT_SECRET antes de iniciar a API.');
  process.exit(1);
}

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/livros', livroRoutes);
app.use('/api/leituras', leituraRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API do BookNest está funcionando!'
  });
});

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

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`BookNest API disponível na porta ${PORT}`);
});
