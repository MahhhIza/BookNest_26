import { ConflictError, NotFoundError, ValidationError } from '../../errors/AppError';
import type { IRepository } from '../interfaces/IRepository';

export interface RespostaPaginada<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ERRO_EXCLUIR_COM_VINCULO = 1451;
const ERRO_PAI_NAO_EXISTE = 1452;

function codigoMysql(erro: unknown): number | undefined {
  if (typeof erro === 'object' && erro !== null && 'errno' in erro) {
    return Number((erro as { errno: unknown }).errno);
  }

  return undefined;
}

export abstract class BaseService<T extends { id: number }, TInput> {
  protected abstract readonly mensagemVinculo: string;

  protected readonly mensagemPaiInexistente: string =
    'Um dos registros relacionados não existe.';

  constructor(protected readonly repositorio: IRepository<T, TInput>) {}

  protected abstract validar(dados: unknown): TInput;

  async listar(page: number, limit: number): Promise<RespostaPaginada<T>> {
    const { itens, total } = await this.repositorio.findAll(page, limit);

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

  async buscar(id: number): Promise<T> {
    const registro = await this.repositorio.findById(id);

    if (!registro) {
      throw new NotFoundError();
    }

    return registro;
  }

  async criar(dados: unknown): Promise<T> {
    const entrada = this.validar(dados);

    try {
      return await this.repositorio.create(entrada);
    } catch (erro: unknown) {
      throw this.traduzirErro(erro);
    }
  }

  async atualizar(id: number, dados: unknown): Promise<T> {
    await this.buscar(id);

    const entrada = this.validar(dados);

    try {
      const atualizado = await this.repositorio.update(id, entrada);

      if (!atualizado) {
        throw new NotFoundError();
      }

      return atualizado;
    } catch (erro: unknown) {
      throw this.traduzirErro(erro);
    }
  }

  async remover(id: number): Promise<void> {
    await this.buscar(id);

    try {
      await this.repositorio.delete(id);
    } catch (erro: unknown) {
      throw this.traduzirErro(erro);
    }
  }

  private traduzirErro(erro: unknown): unknown {
    const codigo = codigoMysql(erro);

    if (codigo === ERRO_EXCLUIR_COM_VINCULO) {
      return new ConflictError(this.mensagemVinculo);
    }

    if (codigo === ERRO_PAI_NAO_EXISTE) {
      return new ValidationError(this.mensagemPaiInexistente);
    }

    return erro;
  }
}
