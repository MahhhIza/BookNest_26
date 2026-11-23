
import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { MinhaEstanteController } from '../controllers/MinhaEstanteController';

const minhaEstanteRoutes = Router();
const controller = new MinhaEstanteController();

minhaEstanteRoutes.use(authMiddleware);

minhaEstanteRoutes.get('/', controller.listar);

minhaEstanteRoutes.post('/', controller.adicionar);

minhaEstanteRoutes.delete('/:id', controller.remover);

export default minhaEstanteRoutes;
