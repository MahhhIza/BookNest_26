import database from '../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { IRepository, Pagina } from '../interfaces/IRepository';

export type ValorColuna = string | number | null;

interface LinhaTotal extends RowDataPacket {
  total: number;
}

export abstract class BaseRepository<T extends { id: number }, TInput>
  implements IRepository<T, TInput>
{
  protected abstract readonly tabela: string;

  protected abstract paraEntidade(linha: RowDataPacket): T;

  protected abstract paraColunas(dados: TInput): Record<string, ValorColuna>;

  async findAll(page: number, limit: number): Promise<Pagina<T>> {
    const offset = (page - 1) * limit;

    const [linhas] = await database.query<RowDataPacket[]>(
      `SELECT * FROM ${this.tabela} ORDER BY id LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [totais] = await database.query<LinhaTotal[]>(
      `SELECT COUNT(*) AS total FROM ${this.tabela}`
    );

    return {
      itens: linhas.map((linha) => this.paraEntidade(linha)),
      total: Number(totais[0].total)
    };
  }

  async findById(id: number): Promise<T | null> {
    const [linhas] = await database.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tabela} WHERE id = ?`,
      [id]
    );

    return linhas.length === 0 ? null : this.paraEntidade(linhas[0]);
  }

  async create(dados: TInput): Promise<T> {
    const colunas = this.paraColunas(dados);
    const nomes = Object.keys(colunas);

    const [resultado] = await database.execute<ResultSetHeader>(
      `INSERT INTO ${this.tabela} (${nomes.join(', ')})
       VALUES (${nomes.map(() => '?').join(', ')})`,
      Object.values(colunas)
    );

    const criado = await this.findById(resultado.insertId);

    if (!criado) {
      throw new Error('Registro criado não foi encontrado.');
    }

    return criado;
  }

  async update(id: number, dados: TInput): Promise<T | null> {
    const colunas = this.paraColunas(dados);
    const atribuicoes = Object.keys(colunas).map((nome) => `${nome} = ?`);

    await database.execute(
      `UPDATE ${this.tabela} SET ${atribuicoes.join(', ')} WHERE id = ?`,
      [...Object.values(colunas), id]
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [resultado] = await database.execute<ResultSetHeader>(
      `DELETE FROM ${this.tabela} WHERE id = ?`,
      [id]
    );

    return resultado.affectedRows > 0;
  }
}
