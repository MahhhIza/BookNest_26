import { BaseService } from '../../../shared/services/BaseService';
import { Validador } from '../../../shared/utils/Validador';
import type { Categoria, CategoriaInput } from '../entities/Categoria';
import { CategoriaRepository } from '../repositories/CategoriaRepository';

export class CategoriaService extends BaseService<Categoria, CategoriaInput> {
  protected readonly mensagemVinculo =
    'Esta categoria tem livros cadastrados e não pode ser excluída.';

  constructor() {
    super(new CategoriaRepository());
  }

  protected validar(dados: unknown): CategoriaInput {
    const validador = Validador.de(dados);

    const nome = validador.texto('nome', 100);
    const descricao = validador.textoOpcional('descricao', 255) ?? '';

    validador.concluir();

    return { nome, descricao };
  }
}
