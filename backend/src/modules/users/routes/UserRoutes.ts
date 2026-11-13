
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../../auth/middlewares/authMiddleware';

const userRoutes = Router();

const userController = new UserController();

// Cadastro público de usuários.
userRoutes.post(
  '/users',
  userController.create.bind(userController)
);

// Consulta o perfil do usuário autenticado.
userRoutes.get(
  '/users/me',
  authenticate,
  userController.getProfile.bind(userController)
);

// Atualiza o perfil do usuário autenticado.
userRoutes.put(
  '/users/me',
  authenticate,
  userController.updateProfile.bind(userController)
);

export default userRoutes;
