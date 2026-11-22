
import { Router } from 'express';
import { OpenLibraryController } from './OpenLibraryController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const openLibraryRoutes = Router();
const controller = new OpenLibraryController();

openLibraryRoutes.use(authMiddleware);

openLibraryRoutes.get('/pesquisar', controller.pesquisar);

export default openLibraryRoutes;
