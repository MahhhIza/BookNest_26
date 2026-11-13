import type { RowDataPacket } from 'mysql2';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import type { ValorColuna } from '../../../shared/repositories/BaseRepository';
import type { Categoria, CategoriaInput } from '../entities/Categoria';

interface CategoriaRow extends RowDataPacket {
  id: number;
  nome: string;
  descricao: string;
}

export class CategoriaRepository extends BaseRepository<Categoria, CategoriaInput> {
  protected readonly tabela = 'categorias';

  protected paraEntidade(linha: RowDataPacket): Categoria {
    const row = linha as CategoriaRow;

    return { id: row.id, nome: row.nome, descricao: row.descricao };
  }

  protected paraColunas(dados: CategoriaInput): Record<string, ValorColuna> {
    return { nome: dados.nome, descricao: dados.descricao };
  }
}
