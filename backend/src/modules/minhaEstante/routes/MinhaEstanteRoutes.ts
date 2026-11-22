
import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { MinhaEstanteController } from '../controllers/MinhaEstanteController';

const minhaEstanteRoutes = Router();
const controller = new MinhaEstanteController();

// Todas as rotas exigem autenticação.
minhaEstanteRoutes.use(authMiddleware);

// Lista os livros da estante do usuário autenticado.
minhaEstanteRoutes.get('/', controller.listar);

// Adiciona um livro à estante pessoal.
minhaEstanteRoutes.post('/', controller.adicionar);

// Remove um livro da estante pessoal.
minhaEstanteRoutes.delete('/:id', controller.remover);

export default minhaEstanteRoutes;
