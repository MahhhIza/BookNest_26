import { BaseController } from '../../../shared/controllers/BaseController';
import type { Categoria, CategoriaInput } from '../entities/Categoria';
import { CategoriaService } from '../services/CategoriaService';

export class CategoriaController extends BaseController<Categoria, CategoriaInput> {
  constructor() {
    super(new CategoriaService());
  }
}
