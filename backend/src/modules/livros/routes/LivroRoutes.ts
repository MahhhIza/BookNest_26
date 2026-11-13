import { criarRotasCrud } from '../../../shared/routes/criarRotasCrud';
import { LivroController } from '../controllers/LivroController';

const livroRoutes = criarRotasCrud(new LivroController());

export default livroRoutes;
