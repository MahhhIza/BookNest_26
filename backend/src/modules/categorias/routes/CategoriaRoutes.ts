import { criarRotasCrud } from '../../../shared/routes/criarRotasCrud';
import { CategoriaController } from '../controllers/CategoriaController';

const categoriaRoutes = criarRotasCrud(new CategoriaController());

export default categoriaRoutes;
