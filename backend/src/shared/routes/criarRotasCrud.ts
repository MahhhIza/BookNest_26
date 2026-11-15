import { Router } from 'express';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import type { BaseController } from '../controllers/BaseController';

export function criarRotasCrud<T extends { id: number }, TInput>(
  controller: BaseController<T, TInput>
): Router {
  const rotas = Router();

  rotas.use(authMiddleware);

  rotas.get('/', controller.listar);
  rotas.get('/:id', controller.buscar);
  rotas.post('/', adminMiddleware, controller.criar);
  rotas.put('/:id', adminMiddleware, controller.atualizar);
  rotas.delete('/:id', adminMiddleware, controller.remover);

  return rotas;
}
