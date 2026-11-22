import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { LeituraController } from '../controllers/LeituraController';

const leituraRoutes = Router();
const controller = new LeituraController();

leituraRoutes.use(authMiddleware);

leituraRoutes.get('/', controller.listar);
leituraRoutes.get('/:id', controller.buscar);
leituraRoutes.post('/', controller.criar);
leituraRoutes.put('/:id', controller.atualizar);
leituraRoutes.delete('/:id', controller.remover);

export default leituraRoutes;
