import { Leitura } from '../entities/Leitura';
import { LeituraRepository } from '../repositories/LeituraRepository';
import { LivroRepository } from '../../livros/repositories/LivroRepository';
import { LeituraValidator } from '../validators/LeituraValidator';

interface CreateLeituraDTO {
  livroId: number;
  status: string;
  nota?: number | null;
  concluidaEm?: string | null;
}

export class LeituraService {
  private leituraRepository: LeituraRepository;
  private livroRepository: LivroRepository;

  constructor() {
    this.leituraRepository = new LeituraRepository();
    this.livroRepository = new LivroRepository();
  }

  async create(dados: CreateLeituraDTO): Promise<number> {
    const nota = dados.nota ?? null;
    const concluidaEm = dados.concluidaEm ?? null;

    LeituraValidator.validate(
      dados.livroId,
      dados.status,
      nota,
      concluidaEm
    );

    const livro = await this.livroRepository.findById(dados.livroId);

    if (!livro) {
      throw new Error('Livro não encontrado.');
    }

    const leitura = new Leitura(
      dados.livroId,
      dados.status,
      nota,
      concluidaEm
    );

    return this.leituraRepository.create(leitura);
  }

  async findAll(page: number, limit: number) {
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      throw new Error('Parâmetros de paginação inválidos.');
    }

    return this.leituraRepository.findAll(page, limit);
  }

  async findById(id: number): Promise<Leitura> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID da leitura inválido.');
    }

    const leitura = await this.leituraRepository.findById(id);

    if (!leitura) {
      throw new Error('Leitura não encontrada.');
    }

    return leitura;
  }

  async update(id: number, dados: CreateLeituraDTO): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID da leitura inválido.');
    }

    const leituraExistente = await this.leituraRepository.findById(id);

    if (!leituraExistente) {
      throw new Error('Leitura não encontrada.');
    }

    const nota = dados.nota ?? null;
    const concluidaEm = dados.concluidaEm ?? null;

    LeituraValidator.validate(
      dados.livroId,
      dados.status,
      nota,
      concluidaEm
    );

    const livro = await this.livroRepository.findById(dados.livroId);

    if (!livro) {
      throw new Error('Livro não encontrado.');
    }

    const leituraAtualizada = new Leitura(
      dados.livroId,
      dados.status,
      nota,
      concluidaEm,
      id
    );

    await this.leituraRepository.update(id, leituraAtualizada);
  }

  async delete(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID da leitura inválido.');
    }

    const leitura = await this.leituraRepository.findById(id);

    if (!leitura) {
      throw new Error('Leitura não encontrada.');
    }

    await this.leituraRepository.delete(id);
  }
}