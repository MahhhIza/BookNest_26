import type { RowDataPacket } from 'mysql2';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import type { ValorColuna } from '../../../shared/repositories/BaseRepository';
import type { Leitura, LeituraInput, StatusLeitura } from '../entities/Leitura';

interface LeituraRow extends RowDataPacket {
  id: number;
  livro_id: number;
  status: StatusLeitura;
  nota: number | null;
  concluida_em: string | null;
}

export class LeituraRepository extends BaseRepository<Leitura, LeituraInput> {
  protected readonly tabela = 'leituras';

  protected paraEntidade(linha: RowDataPacket): Leitura {
    const row = linha as LeituraRow;

    return {
      id: row.id,
      livroId: row.livro_id,
      status: row.status,
      nota: row.nota,
      concluidaEm: row.concluida_em
    };
  }

  protected paraColunas(dados: LeituraInput): Record<string, ValorColuna> {
    return {
      livro_id: dados.livroId,
      status: dados.status,
      nota: dados.nota,
      concluida_em: dados.concluidaEm
    };
  }
}
