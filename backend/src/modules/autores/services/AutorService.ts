import { BaseService } from '../../../shared/services/BaseService';
import { Validador } from '../../../shared/utils/Validador';
import type { Autor, AutorInput } from '../entities/Autor';
import { AutorRepository } from '../repositories/AutorRepository';

export class AutorService extends BaseService<Autor, AutorInput> {
  protected readonly mensagemVinculo =
    'Este autor tem livros cadastrados e não pode ser excluído.';

  constructor() {
    super(new AutorRepository());
  }

  protected validar(dados: unknown): AutorInput {
    const validador = Validador.de(dados);

    const nome = validador.texto('nome', 150);
    const nacionalidade = validador.textoOpcional('nacionalidade', 100) ?? '';

    validador.concluir();

    return { nome, nacionalidade };
  }
}
