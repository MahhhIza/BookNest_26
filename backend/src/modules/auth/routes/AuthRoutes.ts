
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

// Rota responsável pelo login.
authRoutes.post(
  '/login',
  authController.login.bind(authController)
);

export default authRoutes;
