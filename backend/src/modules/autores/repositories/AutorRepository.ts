
import database from '../../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Autor } from '../entities/Autor';

// Representa uma linha retornada pela tabela autores.
interface AutorRow extends RowDataPacket {
  id: number;
  nome: string;
  nacionalidade: string;
}

// Representa o resultado da consulta paginada.
export interface PaginatedAutores {
  data: Autor[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class AutorRepository {
  // Cadastra um novo autor.
  async create(autor: Autor): Promise<Autor> {
    const [result] = await database.execute<ResultSetHeader>(
      `INSERT INTO autores (nome, nacionalidade)
       VALUES (?, ?)`,
      [autor.getNome(), autor.getNacionalidade()]
    );

    return new Autor(
      autor.getNome(),
      autor.getNacionalidade(),
      result.insertId
    );
  }

  // Consulta os autores com paginação.
  async findAll(
    page: number,
    limit: number
  ): Promise<PaginatedAutores> {
    const offset = (page - 1) * limit;

    const [rows] = await database.execute<AutorRow[]>(
      `SELECT id, nome, nacionalidade
       FROM autores
       ORDER BY id ASC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countRows] = await database.execute<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM autores'
    );

    const total = Number(countRows[0].total);

    return {
      data: rows.map(
        (row) => new Autor(row.nome, row.nacionalidade, row.id)
      ),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Busca um autor pelo identificador.
  async findById(id: number): Promise<Autor | null> {
    const [rows] = await database.execute<AutorRow[]>(
      `SELECT id, nome, nacionalidade
       FROM autores
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const autor = rows[0];

    return new Autor(
      autor.nome,
      autor.nacionalidade,
      autor.id
    );
  }

  // Atualiza os dados de um autor.
  async update(autor: Autor): Promise<Autor | null> {
    const id = autor.getId();

    if (id === null) {
      return null;
    }

    const [result] = await database.execute<ResultSetHeader>(
      `UPDATE autores
       SET nome = ?, nacionalidade = ?
       WHERE id = ?`,
      [autor.getNome(), autor.getNacionalidade(), id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.findById(id);
  }

  // Exclui um autor pelo identificador.
  async delete(id: number): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(
      'DELETE FROM autores WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}
