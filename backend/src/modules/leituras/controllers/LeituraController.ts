import { BaseController } from '../../../shared/controllers/BaseController';
import type { Leitura, LeituraInput } from '../entities/Leitura';
import { LeituraService } from '../services/LeituraService';

export class LeituraController extends BaseController<Leitura, LeituraInput> {
  constructor() {
    super(new LeituraService());
  }
}
