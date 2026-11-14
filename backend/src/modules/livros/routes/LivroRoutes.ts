
import { Router } from 'express';
import { LivroController } from '../controllers/LivroController';
import {
  authenticate,
  requireAdmin
} from '../../auth/middlewares/authMiddleware';

const livroRoutes = Router();
const livroController = new LivroController();

// Todas as rotas exigem autenticação.
livroRoutes.use(authenticate);

// Consultas disponíveis para qualquer usuário autenticado.
livroRoutes.get(
  '/livros',
  livroController.findAll.bind(livroController)
);

livroRoutes.get(
  '/livros/:id',
  livroController.findById.bind(livroController)
);

// Operações de escrita exclusivas para administradores.
livroRoutes.post(
  '/livros',
  requireAdmin,
  livroController.create.bind(livroController)
);

livroRoutes.put(
  '/livros/:id',
  requireAdmin,
  livroController.update.bind(livroController)
);

livroRoutes.delete(
  '/livros/:id',
  requireAdmin,
  livroController.delete.bind(livroController)
);

export default livroRoutes;
