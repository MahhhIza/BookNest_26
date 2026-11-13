import type { RowDataPacket } from 'mysql2';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import type { ValorColuna } from '../../../shared/repositories/BaseRepository';
import type { Livro, LivroInput } from '../entities/Livro';

interface LivroRow extends RowDataPacket {
  id: number;
  titulo: string;
  autor_id: number;
  categoria_id: number;
  paginas: number;
  ano: number;
  capa_url: string | null;
}

export class LivroRepository extends BaseRepository<Livro, LivroInput> {
  protected readonly tabela = 'livros';

  protected paraEntidade(linha: RowDataPacket): Livro {
    const row = linha as LivroRow;

    return {
      id: row.id,
      titulo: row.titulo,
      autorId: row.autor_id,
      categoriaId: row.categoria_id,
      paginas: row.paginas,
      ano: row.ano,
      capaUrl: row.capa_url
    };
  }

  protected paraColunas(dados: LivroInput): Record<string, ValorColuna> {
    return {
      titulo: dados.titulo,
      autor_id: dados.autorId,
      categoria_id: dados.categoriaId,
      paginas: dados.paginas,
      ano: dados.ano,
      capa_url: dados.capaUrl
    };
  }
}
