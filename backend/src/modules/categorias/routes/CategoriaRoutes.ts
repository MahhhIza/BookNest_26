
import { Router } from 'express';
import { CategoriaController } from '../controllers/CategoriaController';
import { authenticate, requireAdmin } from '../../auth/middlewares/authMiddleware';

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

// Todas as rotas exigem autenticação.
categoriaRoutes.use(authenticate);

// Consultas: qualquer usuário autenticado pode acessar.
categoriaRoutes.get(
  '/categorias',
  categoriaController.findAll.bind(categoriaController)
);

categoriaRoutes.get(
  '/categorias/:id',
  categoriaController.findById.bind(categoriaController)
);

// Operações de escrita: somente administradores.
categoriaRoutes.post(
  '/categorias',
  requireAdmin,
  categoriaController.create.bind(categoriaController)
);

categoriaRoutes.put(
  '/categorias/:id',
  requireAdmin,
  categoriaController.update.bind(categoriaController)
);

categoriaRoutes.delete(
  '/categorias/:id',
  requireAdmin,
  categoriaController.delete.bind(categoriaController)
);

export default categoriaRoutes;
