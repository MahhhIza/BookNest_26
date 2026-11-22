
import { ConflictError, NotFoundError, ValidationError } from '../../../errors/AppError';
import { Validador } from '../../../shared/utils/Validador';
import type { MinhaEstante, MinhaEstanteInput } from '../entities/MinhaEstante';
import { MinhaEstanteRepository } from '../repositories/MinhaEstanteRepository';

function codigoMysql(erro: unknown): string | undefined {
  if (
    typeof erro === 'object' &&
    erro !== null &&
    'code' in erro &&
    typeof (erro as { code: unknown }).code === 'string'
  ) {
    return (erro as { code: string }).code;
  }

  return undefined;
}

export class MinhaEstanteService {
  private readonly repositorio = new MinhaEstanteRepository();

  private validar(dados: unknown): MinhaEstanteInput {
    const validador = Validador.de(dados);

    const openLibraryId = validador.texto('openLibraryId', 100);
    const titulo = validador.texto('titulo', 500);

    const autores = this.validarLista(dados, 'autores', 20, 150, validador);
    const assuntos = this.validarLista(dados, 'assuntos', 20, 150, validador);

    const anoPublicacao = this.validarNumeroOpcional(
      dados, 'anoPublicacao', 1, new Date().getFullYear() + 1, validador
    );

    const paginas = this.validarNumeroOpcional(
      dados, 'paginas', 1, 100000, validador
    );

    const capaUrl = validador.textoOpcional('capaUrl', 500);
    const isbn = validador.textoOpcional('isbn', 20);

    if (capaUrl !== null && !/^https:\/\/covers\.openlibrary\.org\//i.test(capaUrl)) {
      validador.erro('capaUrl', 'Informe uma URL válida de capa da Open Library.');
    }

    if (openLibraryId && !/^\/works\/OL\d+W$/.test(openLibraryId)) {
      validador.erro('openLibraryId', 'Identificador da Open Library inválido.');
    }

    validador.concluir();

    return {
      openLibraryId,
      titulo,
      autores,
      assuntos,
      anoPublicacao,
      paginas,
      capaUrl,
      isbn
    };
  }

  private validarLista(
    dados: unknown,
    campo: string,
    maxItens: number,
    maxCaracteres: number,
    validador: Validador
  ): string[] {
    if (typeof dados !== 'object' || dados === null || Array.isArray(dados)) {
      return [];
    }

    const valor = (dados as Record<string, unknown>)[campo];

    if (!Array.isArray(valor)) {
      validador.erro(campo, 'Informe uma lista válida.');
      return [];
    }

    if (valor.length > maxItens) {
      validador.erro(campo, `Informe no máximo ${maxItens} itens.`);
    }

    const lista: string[] = [];

    valor.forEach((item, indice) => {
      if (typeof item !== 'string' || !item.trim()) {
        validador.erro(campo, `O item ${indice + 1} é inválido.`);
        return;
      }

      const texto = item.trim();

      if (texto.length > maxCaracteres) {
        validador.erro(campo, `Cada item deve ter no máximo ${maxCaracteres} caracteres.`);
        return;
      }

      lista.push(texto);
    });

    return lista;
  }

  private validarNumeroOpcional(
    dados: unknown,
    campo: string,
    minimo: number,
    maximo: number,
    validador: Validador
  ): number | null {
    if (typeof dados !== 'object' || dados === null || Array.isArray(dados)) {
      return null;
    }

    const valor = (dados as Record<string, unknown>)[campo];

    if (valor === undefined || valor === null) {
      return null;
    }

    if (
      typeof valor !== 'number' ||
      !Number.isInteger(valor) ||
      valor < minimo ||
      valor > maximo
    ) {
      validador.erro(campo, `Informe um número inteiro entre ${minimo} e ${maximo}.`);
      return null;
    }

    return valor;
  }

  async listar(usuarioId: number): Promise<MinhaEstante[]> {
    return this.repositorio.listarPorUsuario(usuarioId);
  }

  async adicionar(usuarioId: number, dados: unknown): Promise<MinhaEstante> {
    const entrada = this.validar(dados);

    const existente = await this.repositorio.buscarPorLivro(
      usuarioId,
      entrada.openLibraryId
    );

    if (existente) {
      throw new ConflictError('Este livro já está na sua estante.');
    }

    try {
      return await this.repositorio.adicionar(usuarioId, entrada);
    } catch (erro: unknown) {
      if (codigoMysql(erro) === 'ER_DUP_ENTRY') {
        throw new ConflictError('Este livro já está na sua estante.');
      }

      throw erro;
    }
  }

  async remover(id: number, usuarioId: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('Identificador do livro inválido.');
    }

    const removido = await this.repositorio.remover(id, usuarioId);

    if (!removido) {
      throw new NotFoundError('Livro não encontrado na sua estante.');
    }
  }
}
