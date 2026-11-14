
import database from '../../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Categoria } from '../entities/Categoria';

// Representa uma linha retornada pela tabela categorias.
interface CategoriaRow extends RowDataPacket {
  id: number;
  nome: string;
  descricao: string;
}

// Representa o resultado da consulta paginada.
export interface PaginatedCategorias {
  data: Categoria[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class CategoriaRepository {
  // Cadastra uma nova categoria.
  async create(categoria: Categoria): Promise<Categoria> {
    const [result] = await database.execute<ResultSetHeader>(
      `INSERT INTO categorias (nome, descricao)
       VALUES (?, ?)`,
      [categoria.getNome(), categoria.getDescricao()]
    );

    return new Categoria(
      categoria.getNome(),
      categoria.getDescricao(),
      result.insertId
    );
  }

  // Consulta as categorias com paginação.
  async findAll(
    page: number,
    limit: number
  ): Promise<PaginatedCategorias> {
    const offset = (page - 1) * limit;

    const [rows] = await database.execute<CategoriaRow[]>(
      `SELECT id, nome, descricao
       FROM categorias
       ORDER BY id ASC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countRows] = await database.execute<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM categorias'
    );

    const total = Number(countRows[0].total);

    return {
      data: rows.map(
        (row) => new Categoria(row.nome, row.descricao, row.id)
      ),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Busca uma categoria pelo identificador.
  async findById(id: number): Promise<Categoria | null> {
    const [rows] = await database.execute<CategoriaRow[]>(
      `SELECT id, nome, descricao
       FROM categorias
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const categoria = rows[0];

    return new Categoria(
      categoria.nome,
      categoria.descricao,
      categoria.id
    );
  }

  // Atualiza os dados de uma categoria.
  async update(categoria: Categoria): Promise<Categoria | null> {
    const id = categoria.getId();

    if (id === null) {
      return null;
    }

    const [result] = await database.execute<ResultSetHeader>(
      `UPDATE categorias
       SET nome = ?, descricao = ?
       WHERE id = ?`,
      [categoria.getNome(), categoria.getDescricao(), id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.findById(id);
  }

  // Exclui uma categoria pelo identificador.
  async delete(id: number): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(
      'DELETE FROM categorias WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}
