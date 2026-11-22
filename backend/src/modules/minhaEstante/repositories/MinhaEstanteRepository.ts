
import database from '../../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type {
  MinhaEstante,
  MinhaEstanteInput
} from '../entities/MinhaEstante';

interface MinhaEstanteRow extends RowDataPacket {
  id: number;
  usuario_id: number;
  open_library_id: string;
  titulo: string;
  autores: string[] | string;
  assuntos: string[] | string;
  ano_publicacao: number | null;
  paginas: number | null;
  capa_url: string | null;
  isbn: string | null;
  created_at: string | null;
}

function converterLista(valor: string[] | string): string[] {
  if (Array.isArray(valor)) {
    return valor;
  }

  try {
    const convertido: unknown = JSON.parse(valor);

    return Array.isArray(convertido)
      ? convertido.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export class MinhaEstanteRepository {
  private paraEntidade(linha: MinhaEstanteRow): MinhaEstante {
    return {
      id: linha.id,
      usuarioId: linha.usuario_id,
      openLibraryId: linha.open_library_id,
      titulo: linha.titulo,
      autores: converterLista(linha.autores),
      assuntos: converterLista(linha.assuntos),
      anoPublicacao: linha.ano_publicacao,
      paginas: linha.paginas,
      capaUrl: linha.capa_url,
      isbn: linha.isbn,
      createdAt: linha.created_at
    };
  }

  async listarPorUsuario(usuarioId: number): Promise<MinhaEstante[]> {
    const [linhas] = await database.execute<MinhaEstanteRow[]>(
      `SELECT *
       FROM minha_estante
       WHERE usuario_id = ?
       ORDER BY id DESC`,
      [usuarioId]
    );

    return linhas.map((linha) => this.paraEntidade(linha));
  }

  async buscarPorLivro(
    usuarioId: number,
    openLibraryId: string
  ): Promise<MinhaEstante | null> {
    const [linhas] = await database.execute<MinhaEstanteRow[]>(
      `SELECT *
       FROM minha_estante
       WHERE usuario_id = ? AND open_library_id = ?
       LIMIT 1`,
      [usuarioId, openLibraryId]
    );

    return linhas.length === 0
      ? null
      : this.paraEntidade(linhas[0]);
  }

  async adicionar(
    usuarioId: number,
    dados: MinhaEstanteInput
  ): Promise<MinhaEstante> {
    const [resultado] = await database.execute<ResultSetHeader>(
      `INSERT INTO minha_estante (
        usuario_id,
        open_library_id,
        titulo,
        autores,
        assuntos,
        ano_publicacao,
        paginas,
        capa_url,
        isbn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        dados.openLibraryId,
        dados.titulo,
        JSON.stringify(dados.autores),
        JSON.stringify(dados.assuntos),
        dados.anoPublicacao,
        dados.paginas,
        dados.capaUrl,
        dados.isbn
      ]
    );

    const [linhas] = await database.execute<MinhaEstanteRow[]>(
      `SELECT *
       FROM minha_estante
       WHERE id = ? AND usuario_id = ?
       LIMIT 1`,
      [resultado.insertId, usuarioId]
    );

    if (linhas.length === 0) {
      throw new Error('Livro adicionado, mas não foi possível recuperá-lo.');
    }

    return this.paraEntidade(linhas[0]);
  }

  async remover(id: number, usuarioId: number): Promise<boolean> {
    const [resultado] = await database.execute<ResultSetHeader>(
      `DELETE FROM minha_estante
       WHERE id = ? AND usuario_id = ?`,
      [id, usuarioId]
    );

    return resultado.affectedRows > 0;
  }
}
