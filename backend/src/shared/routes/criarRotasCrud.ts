import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import type { BaseController } from '../controllers/BaseController';

export function criarRotasCrud<T extends { id: number }, TInput>(
  controller: BaseController<T, TInput>
): Router {
  const rotas = Router();

  rotas.use(authMiddleware);

  rotas.get('/', controller.listar);
  rotas.get('/:id', controller.buscar);
  rotas.post('/', controller.criar);
  rotas.put('/:id', controller.atualizar);
  rotas.delete('/:id', controller.remover);

  return rotas;
}
