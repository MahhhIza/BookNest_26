
import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { UserController } from '../controllers/UserController';

const userRoutes = Router();

const userController = new UserController();

userRoutes.post(
  '/users',
  userController.create.bind(userController)
);

userRoutes.get(
  '/users/me',
  authMiddleware,
  userController.me.bind(userController)
);

userRoutes.put(
  '/users/me',
  authMiddleware,
  userController.updateMe.bind(userController)
);

export default userRoutes;
