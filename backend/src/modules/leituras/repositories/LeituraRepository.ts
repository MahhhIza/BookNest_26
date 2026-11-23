import database from '../../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Pagina } from '../../../shared/interfaces/IRepository';
import type { Leitura, LeituraInput, StatusLeitura } from '../entities/Leitura';

interface LeituraRow extends RowDataPacket {
  id: number;
  livro_id: number | null;
  open_library_id: string | null;
  livro_titulo: string;
  livro_capa_url: string | null;
  livro_paginas: number | null;
  status: StatusLeitura;
  nota: number | null;
  concluida_em: string | null;
}

interface LinhaTotal extends RowDataPacket {
  total: number;
}

export class LeituraRepository {
  private readonly consultaBase = `
    SELECT
      le.id,
      le.livro_id,
      le.open_library_id,
      COALESCE(l.titulo, me.titulo) AS livro_titulo,
      COALESCE(l.capa_url, me.capa_url) AS livro_capa_url,
      COALESCE(l.paginas, me.paginas) AS livro_paginas,
      le.status,
      le.nota,
      le.concluida_em
    FROM leituras le
    LEFT JOIN livros l ON l.id = le.livro_id
    LEFT JOIN minha_estante me
      ON me.usuario_id = le.usuario_id
      AND me.open_library_id = le.open_library_id
  `;

  private paraEntidade(linha: LeituraRow): Leitura {
    return {
      id: linha.id,
      livroId: linha.livro_id,
      openLibraryId: linha.open_library_id,
      livroTitulo: linha.livro_titulo,
      livroCapaUrl: linha.livro_capa_url,
      livroPaginas: linha.livro_paginas,
      status: linha.status,
      nota: linha.nota,
      concluidaEm: linha.concluida_em
    };
  }

  async listarPorUsuario(
    usuarioId: number,
    page: number,
    limit: number
  ): Promise<Pagina<Leitura>> {
    const offset = (page - 1) * limit;

    const [linhas] = await database.execute<LeituraRow[]>(
      `${this.consultaBase}
       WHERE le.usuario_id = ?
       ORDER BY le.id
       LIMIT ? OFFSET ?`,
      [usuarioId, limit, offset]
    );

    const [totais] = await database.execute<LinhaTotal[]>(
      'SELECT COUNT(*) AS total FROM leituras WHERE usuario_id = ?',
      [usuarioId]
    );

    return {
      itens: linhas.map((linha) => this.paraEntidade(linha)),
      total: Number(totais[0].total)
    };
  }

  async buscarPorUsuario(
    id: number,
    usuarioId: number
  ): Promise<Leitura | null> {
    const [linhas] = await database.execute<LeituraRow[]>(
      `${this.consultaBase}
       WHERE le.id = ? AND le.usuario_id = ?`,
      [id, usuarioId]
    );

    return linhas.length === 0
      ? null
      : this.paraEntidade(linhas[0]);
  }

  async criar(
    usuarioId: number,
    dados: LeituraInput
  ): Promise<Leitura> {
    const [resultado] = await database.execute<ResultSetHeader>(
      `INSERT INTO leituras
       (usuario_id, livro_id, open_library_id, status, nota, concluida_em)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        dados.livroId,
        dados.openLibraryId,
        dados.status,
        dados.nota,
        dados.concluidaEm
      ]
    );

    const criada = await this.buscarPorUsuario(
      resultado.insertId,
      usuarioId
    );

    if (!criada) {
      throw new Error('Leitura criada não foi encontrada.');
    }

    return criada;
  }

  async atualizar(
    id: number,
    usuarioId: number,
    dados: LeituraInput
  ): Promise<Leitura | null> {
    await database.execute(
      `UPDATE leituras
       SET livro_id = ?,
           open_library_id = ?,
           status = ?,
           nota = ?,
           concluida_em = ?
       WHERE id = ? AND usuario_id = ?`,
      [
        dados.livroId,
        dados.openLibraryId,
        dados.status,
        dados.nota,
        dados.concluidaEm,
        id,
        usuarioId
      ]
    );

    return this.buscarPorUsuario(id, usuarioId);
  }

  async excluir(id: number, usuarioId: number): Promise<boolean> {
    const [resultado] = await database.execute<ResultSetHeader>(
      'DELETE FROM leituras WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );

    return resultado.affectedRows > 0;
  }
}