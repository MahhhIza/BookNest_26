
import database from '../../../config/database';
import { Livro } from '../entities/Livro';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface LivroRow extends RowDataPacket {
  id: number;
  titulo: string;
  autor_id: number;
  categoria_id: number;
  paginas: number;
  ano: number;
  capa_url: string | null;
}

export interface PaginatedLivros {
  data: Livro[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class LivroRepository {
  async create(livro: Livro): Promise<Livro> {
    const [result] = await database.execute<ResultSetHeader>(
      `INSERT INTO livros
       (titulo, autor_id, categoria_id, paginas, ano, capa_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        livro.getTitulo(),
        livro.getAutorId(),
        livro.getCategoriaId(),
        livro.getPaginas(),
        livro.getAno(),
        livro.getCapaUrl()
      ]
    );

    return new Livro(
      livro.getTitulo(),
      livro.getAutorId(),
      livro.getCategoriaId(),
      livro.getPaginas(),
      livro.getAno(),
      livro.getCapaUrl(),
      result.insertId
    );
  }

  async findAll(page: number, limit: number): Promise<PaginatedLivros> {
    const offset = (page - 1) * limit;

    const [rows] = await database.execute<LivroRow[]>(
      `SELECT id, titulo, autor_id, categoria_id, paginas, ano, capa_url
       FROM livros
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countRows] = await database.execute<RowDataPacket[]>(
      'SELECT COUNT(*) AS total FROM livros'
    );

    const total = Number(countRows[0].total);

    return {
      data: rows.map(row => this.mapRow(row)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: number): Promise<Livro | null> {
    const [rows] = await database.execute<LivroRow[]>(
      `SELECT id, titulo, autor_id, categoria_id, paginas, ano, capa_url
       FROM livros
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRow(rows[0]);
  }

  async update(id: number, livro: Livro): Promise<Livro> {
    await database.execute<ResultSetHeader>(
      `UPDATE livros
       SET titulo = ?, autor_id = ?, categoria_id = ?,
           paginas = ?, ano = ?, capa_url = ?
       WHERE id = ?`,
      [
        livro.getTitulo(),
        livro.getAutorId(),
        livro.getCategoriaId(),
        livro.getPaginas(),
        livro.getAno(),
        livro.getCapaUrl(),
        id
      ]
    );

    return new Livro(
      livro.getTitulo(),
      livro.getAutorId(),
      livro.getCategoriaId(),
      livro.getPaginas(),
      livro.getAno(),
      livro.getCapaUrl(),
      id
    );
  }

  async delete(id: number): Promise<void> {
    await database.execute<ResultSetHeader>(
      'DELETE FROM livros WHERE id = ?',
      [id]
    );
  }

  private mapRow(row: LivroRow): Livro {
    return new Livro(
      row.titulo,
      row.autor_id,
      row.categoria_id,
      row.paginas,
      row.ano,
      row.capa_url,
      row.id
    );
  }
}
