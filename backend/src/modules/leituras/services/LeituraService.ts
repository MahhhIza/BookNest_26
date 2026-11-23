import {
  ConflictError,
  NotFoundError,
  ValidationError
} from '../../../errors/AppError';
import { Validador } from '../../../shared/utils/Validador';
import { STATUS_LEITURA } from '../entities/Leitura';
import type { Leitura, LeituraInput } from '../entities/Leitura';
import { LeituraRepository } from '../repositories/LeituraRepository';

function codigoMysql(erro: unknown): number | undefined {
  if (typeof erro === 'object' && erro !== null && 'errno' in erro) {
    return Number((erro as { errno: unknown }).errno);
  }

  return undefined;
}

export class LeituraService {
  private readonly repositorio = new LeituraRepository();

  async listar(usuarioId: number, page: number, limit: number) {
    const { itens, total } = await this.repositorio.listarPorUsuario(
      usuarioId,
      page,
      limit
    );

    return {
      data: itens,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async buscar(usuarioId: number, id: number): Promise<Leitura> {
    const leitura = await this.repositorio.buscarPorUsuario(id, usuarioId);

    if (!leitura) {
      throw new NotFoundError();
    }

    return leitura;
  }

  async criar(usuarioId: number, dados: unknown): Promise<Leitura> {
    const entrada = this.validar(dados);

    try {
      return await this.repositorio.criar(usuarioId, entrada);
    } catch (erro: unknown) {
      throw this.traduzirErro(erro);
    }
  }

  async atualizar(
    usuarioId: number,
    id: number,
    dados: unknown
  ): Promise<Leitura> {
    await this.buscar(usuarioId, id);
    const entrada = this.validar(dados);

    try {
      const atualizada = await this.repositorio.atualizar(
        id,
        usuarioId,
        entrada
      );

      if (!atualizada) {
        throw new NotFoundError();
      }

      return atualizada;
    } catch (erro: unknown) {
      throw this.traduzirErro(erro);
    }
  }

  async remover(usuarioId: number, id: number): Promise<void> {
    await this.buscar(usuarioId, id);

    const removida = await this.repositorio.excluir(id, usuarioId);

    if (!removida) {
      throw new NotFoundError();
    }
  }

  private validar(dados: unknown): LeituraInput {
    const validador = Validador.de(dados);

    if (typeof dados !== 'object' || dados === null || Array.isArray(dados)) {
      throw new ValidationError('Informe os dados da leitura.');
    }

    const entrada = dados as Record<string, unknown>;

    const temLivroCatalogo =
      entrada.livroId !== undefined &&
      entrada.livroId !== null &&
      entrada.livroId !== '';

    const temLivroPessoal =
      typeof entrada.openLibraryId === 'string' &&
      entrada.openLibraryId.trim() !== '';

    if (temLivroCatalogo === temLivroPessoal) {
      throw new ValidationError(
        'Informe um livro do catálogo ou um livro da sua estante.'
      );
    }

    let livroId: number | null = null;
    let openLibraryId: string | null = null;

    if (temLivroCatalogo) {
      livroId = validador.inteiro('livroId', 1, 2147483647);
    } else {
      openLibraryId = validador.texto('openLibraryId', 100);

      if (!/^\/works\/OL\d+W$/.test(openLibraryId)) {
        validador.erro(
          'openLibraryId',
          'Identificador da Open Library inválido.'
        );
      }
    }

    const status = validador.opcao('status', STATUS_LEITURA);

    let nota: number | null = null;
    let concluidaEm: string | null = null;

    if (status === 'Lido') {
      nota = validador.inteiro('nota', 1, 5);
      concluidaEm = validador.data('concluidaEm');
    }

    validador.concluir();

    return {
      livroId,
      openLibraryId,
      status,
      nota,
      concluidaEm
    };
  }

  private traduzirErro(erro: unknown): unknown {
    const codigo = codigoMysql(erro);

    if (codigo === 1451) {
      return new ConflictError('Esta leitura não pode ser excluída.');
    }

    if (codigo === 1452) {
      return new ValidationError(
        'O livro informado não existe ou não está na sua estante.'
      );
    }

    return erro;
  }
}