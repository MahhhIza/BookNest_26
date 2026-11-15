
import { Router } from 'express';
import { adminMiddleware } from '../../../middlewares/adminMiddleware';
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

userRoutes.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  userController.list.bind(userController)
);

userRoutes.put(
  '/users/:id/role',
  authMiddleware,
  adminMiddleware,
  userController.changeRole.bind(userController)
);

export default userRoutes;
