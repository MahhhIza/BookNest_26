import { BaseController } from '../../../shared/controllers/BaseController';
import type { Autor, AutorInput } from '../entities/Autor';
import { AutorService } from '../services/AutorService';

export class AutorController extends BaseController<Autor, AutorInput> {
  constructor() {
    super(new AutorService());
  }
}
