
import { Router } from 'express';
import { AutorController } from '../controllers/AutorController';
import { authenticate, requireAdmin } from '../../auth/middlewares/authMiddleware';

const autorRoutes = Router();
const autorController = new AutorController();

// Todas as rotas exigem autenticação.
autorRoutes.use(authenticate);

// Consultas: qualquer usuário autenticado pode acessar.
autorRoutes.get(
  '/autores',
  autorController.findAll.bind(autorController)
);

autorRoutes.get(
  '/autores/:id',
  autorController.findById.bind(autorController)
);

// Operações de escrita: somente administradores.
autorRoutes.post(
  '/autores',
  requireAdmin,
  autorController.create.bind(autorController)
);

autorRoutes.put(
  '/autores/:id',
  requireAdmin,
  autorController.update.bind(autorController)
);

autorRoutes.delete(
  '/autores/:id',
  requireAdmin,
  autorController.delete.bind(autorController)
);

export default autorRoutes;
