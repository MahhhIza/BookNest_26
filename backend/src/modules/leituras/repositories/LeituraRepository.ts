import database from '../../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Pagina } from '../../../shared/interfaces/IRepository';
import type { Leitura, LeituraInput, StatusLeitura } from '../entities/Leitura';

interface LeituraRow extends RowDataPacket {
  id: number;
  livro_id: number;
  status: StatusLeitura;
  nota: number | null;
  concluida_em: string | null;
}

interface LinhaTotal extends RowDataPacket {
  total: number;
}

export class LeituraRepository {
  private paraEntidade(linha: RowDataPacket): Leitura {
    const row = linha as LeituraRow;

    return {
      id: row.id,
      livroId: row.livro_id,
      status: row.status,
      nota: row.nota,
      concluidaEm: row.concluida_em
    };
  }

  async listarPorUsuario(
    usuarioId: number,
    page: number,
    limit: number
  ): Promise<Pagina<Leitura>> {
    const offset = (page - 1) * limit;

    const [linhas] = await database.execute<RowDataPacket[]>(
      `SELECT * FROM leituras
       WHERE usuario_id = ?
       ORDER BY id
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
    const [linhas] = await database.execute<RowDataPacket[]>(
      'SELECT * FROM leituras WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );

    return linhas.length === 0 ? null : this.paraEntidade(linhas[0]);
  }

  async criar(
    usuarioId: number,
    dados: LeituraInput
  ): Promise<Leitura> {
    const [resultado] = await database.execute<ResultSetHeader>(
      `INSERT INTO leituras
       (usuario_id, livro_id, status, nota, concluida_em)
       VALUES (?, ?, ?, ?, ?)`,
      [
        usuarioId,
        dados.livroId,
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
       SET livro_id = ?, status = ?, nota = ?, concluida_em = ?
       WHERE id = ? AND usuario_id = ?`,
      [
        dados.livroId,
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
