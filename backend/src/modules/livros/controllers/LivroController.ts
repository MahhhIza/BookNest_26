import { BaseController } from '../../../shared/controllers/BaseController';
import type { Livro, LivroInput } from '../entities/Livro';
import { LivroService } from '../services/LivroService';

export class LivroController extends BaseController<Livro, LivroInput> {
  constructor() {
    super(new LivroService());
  }
}
