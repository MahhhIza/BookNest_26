import type { RowDataPacket } from 'mysql2';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import type { ValorColuna } from '../../../shared/repositories/BaseRepository';
import type { Autor, AutorInput } from '../entities/Autor';

interface AutorRow extends RowDataPacket {
  id: number;
  nome: string;
  nacionalidade: string;
}

export class AutorRepository extends BaseRepository<Autor, AutorInput> {
  protected readonly tabela = 'autores';

  protected paraEntidade(linha: RowDataPacket): Autor {
    const row = linha as AutorRow;

    return { id: row.id, nome: row.nome, nacionalidade: row.nacionalidade };
  }

  protected paraColunas(dados: AutorInput): Record<string, ValorColuna> {
    return { nome: dados.nome, nacionalidade: dados.nacionalidade };
  }
}
