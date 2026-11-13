import { criarRotasCrud } from '../../../shared/routes/criarRotasCrud';
import { AutorController } from '../controllers/AutorController';

const autorRoutes = criarRotasCrud(new AutorController());

export default autorRoutes;
