
import database from '../../../config/database';
import { Leitura } from '../entities/Leitura';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Representa uma linha da tabela leituras no MySQL.
interface LeituraRow extends RowDataPacket {
  id: number;
  livro_id: number;
  status: string;
  nota: number | null;
  concluida_em: Date | string | null;
}

// Estrutura da resposta paginada.
export interface PaginatedLeituras {
  data: Leitura[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class LeituraRepository {
  // Converte os dados do banco para a entidade Leitura.
  private mapRow(row: LeituraRow): Leitura {
    let concluidaEm: string | null = null;

    if (row.concluida_em) {
      if (row.concluida_em instanceof Date) {
        concluidaEm = row.concluida_em.toISOString().slice(0, 10);
      } else {
        concluidaEm = String(row.concluida_em).slice(0, 10);
      }
    }

    return new Leitura(
      row.livro_id,
      row.status,
      row.nota,
      concluidaEm,
      row.id
    );
  }

  // Cadastra uma nova leitura.
  async create(leitura: Leitura): Promise<number> {
    const [result] = await database.execute<ResultSetHeader>(
      `INSERT INTO leituras
        (livro_id, status, nota, concluida_em)
       VALUES (?, ?, ?, ?)`,
      [
        leitura.getLivroId(),
        leitura.getStatus(),
        leitura.getNota(),
        leitura.getConcluidaEm()
      ]
    );

    return result.insertId;
  }

  // Consulta leituras com paginação.
  async findAll(
    page: number,
    limit: number
  ): Promise<PaginatedLeituras> {
    const offset = (page - 1) * limit;

    const [rows] = await database.execute<LeituraRow[]>(
      `SELECT id, livro_id, status, nota, concluida_em
       FROM leituras
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countRows] = await database.execute<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM leituras'
    );

    const total = Number(countRows[0].total);

    return {
      data: rows.map((row) => this.mapRow(row)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Busca uma leitura pelo ID.
  async findById(id: number): Promise<Leitura | null> {
    const [rows] = await database.execute<LeituraRow[]>(
      `SELECT id, livro_id, status, nota, concluida_em
       FROM leituras
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRow(rows[0]);
  }

  // Atualiza uma leitura existente.
  async update(
    id: number,
    leitura: Leitura
  ): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(
      `UPDATE leituras
       SET livro_id = ?, status = ?, nota = ?, concluida_em = ?
       WHERE id = ?`,
      [
        leitura.getLivroId(),
        leitura.getStatus(),
        leitura.getNota(),
        leitura.getConcluidaEm(),
        id
      ]
    );

    return result.affectedRows > 0;
  }

  // Exclui uma leitura pelo ID.
  async delete(id: number): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(
      'DELETE FROM leituras WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}
