import { Router } from 'express';
import { LeituraController } from '../controllers/LeituraController';
import { authenticate, requireAdmin } from '../../auth/middlewares/authMiddleware';

const router = Router();
const leituraController = new LeituraController();

// Todas as rotas exigem autenticação.
router.use(authenticate);

// Consulta: qualquer usuário autenticado.
router.get('/leituras', (req, res) =>
  leituraController.findAll(req, res)
);

router.get('/leituras/:id', (req, res) =>
  leituraController.findById(req, res)
);

// Escrita: somente administradores.
router.post('/leituras', requireAdmin, (req, res) =>
  leituraController.create(req, res)
);

router.put('/leituras/:id', requireAdmin, (req, res) =>
  leituraController.update(req, res)
);

router.delete('/leituras/:id', requireAdmin, (req, res) =>
  leituraController.delete(req, res)
);

export default router;