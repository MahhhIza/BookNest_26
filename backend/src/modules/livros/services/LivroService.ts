import { BaseService } from '../../../shared/services/BaseService';
import { Validador } from '../../../shared/utils/Validador';
import type { Livro, LivroInput } from '../entities/Livro';
import { LivroRepository } from '../repositories/LivroRepository';

export class LivroService extends BaseService<Livro, LivroInput> {
  protected readonly mensagemVinculo =
    'Este livro tem leituras cadastradas e não pode ser excluído.';

  protected override readonly mensagemPaiInexistente =
    'O autor ou a categoria informada não existe.';

  constructor() {
    super(new LivroRepository());
  }

  protected validar(dados: unknown): LivroInput {
    const validador = Validador.de(dados);

    const anoMaximo = new Date().getFullYear() + 1;

    const titulo = validador.texto('titulo', 200);
    const autorId = validador.inteiro('autorId', 1, 2147483647);
    const categoriaId = validador.inteiro('categoriaId', 1, 2147483647);
    const paginas = validador.inteiro('paginas', 1, 100000);
    const ano = validador.inteiro('ano', 1, anoMaximo);
    const capaUrl = validador.textoOpcional('capaUrl', 500);

    validador.concluir();

    return { titulo, autorId, categoriaId, paginas, ano, capaUrl };
  }
}
