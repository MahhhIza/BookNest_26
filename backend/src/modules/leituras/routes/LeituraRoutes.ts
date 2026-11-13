import { criarRotasCrud } from '../../../shared/routes/criarRotasCrud';
import { LeituraController } from '../controllers/LeituraController';

const leituraRoutes = criarRotasCrud(new LeituraController());

export default leituraRoutes;
