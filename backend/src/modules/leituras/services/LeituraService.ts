import { BaseService } from '../../../shared/services/BaseService';
import { Validador } from '../../../shared/utils/Validador';
import { STATUS_LEITURA } from '../entities/Leitura';
import type { Leitura, LeituraInput } from '../entities/Leitura';
import { LeituraRepository } from '../repositories/LeituraRepository';

export class LeituraService extends BaseService<Leitura, LeituraInput> {
  protected readonly mensagemVinculo =
    'Esta leitura não pode ser excluída.';

  protected override readonly mensagemPaiInexistente =
    'O livro informado não existe.';

  constructor() {
    super(new LeituraRepository());
  }

  protected validar(dados: unknown): LeituraInput {
    const validador = Validador.de(dados);

    const livroId = validador.inteiro('livroId', 1, 2147483647);
    const status = validador.opcao('status', STATUS_LEITURA);

    let nota: number | null = null;
    let concluidaEm: string | null = null;

    if (status === 'Lido') {
      nota = validador.inteiro('nota', 1, 5);
      concluidaEm = validador.data('concluidaEm');
    }

    validador.concluir();

    return { livroId, status, nota, concluidaEm };
  }
}
