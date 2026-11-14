
import { Livro } from '../entities/Livro';
import { LivroRepository } from '../repositories/LivroRepository';
import { LivroValidator } from '../validators/LivroValidator';
import { AutorRepository } from '../../autores/repositories/AutorRepository';
import { CategoriaRepository } from '../../categorias/repositories/CategoriaRepository';

interface CreateLivroDTO {
  titulo: string;
  autorId: number;
  categoriaId: number;
  paginas: number;
  ano: number;
  capaUrl?: string | null;
}

interface UpdateLivroDTO {
  titulo: string;
  autorId: number;
  categoriaId: number;
  paginas: number;
  ano: number;
  capaUrl?: string | null;
}

export class LivroService {
  private readonly livroRepository: LivroRepository;
  private readonly autorRepository: AutorRepository;
  private readonly categoriaRepository: CategoriaRepository;

  constructor() {
    this.livroRepository = new LivroRepository();
    this.autorRepository = new AutorRepository();
    this.categoriaRepository = new CategoriaRepository();
  }

  async create(data: CreateLivroDTO): Promise<Livro> {
    const capaUrl = data.capaUrl ?? null;

    LivroValidator.validate(
      data.titulo,
      data.autorId,
      data.categoriaId,
      data.paginas,
      data.ano,
      capaUrl
    );

    const autor = await this.autorRepository.findById(data.autorId);

    if (!autor) {
      throw new Error('Autor não encontrado.');
    }

    const categoria = await this.categoriaRepository.findById(data.categoriaId);

    if (!categoria) {
      throw new Error('Categoria não encontrada.');
    }

    const livro = new Livro(
      data.titulo.trim(),
      data.autorId,
      data.categoriaId,
      data.paginas,
      data.ano,
      capaUrl?.trim() || null
    );

    return this.livroRepository.create(livro);
  }

  async findAll(page: number, limit: number) {
    this.validatePagination(page, limit);

    return this.livroRepository.findAll(page, limit);
  }

  async findById(id: number): Promise<Livro> {
    this.validateId(id);

    const livro = await this.livroRepository.findById(id);

    if (!livro) {
      throw new Error('Livro não encontrado.');
    }

    return livro;
  }

  async update(id: number, data: UpdateLivroDTO): Promise<Livro> {
    this.validateId(id);

    LivroValidator.validate(
      data.titulo,
      data.autorId,
      data.categoriaId,
      data.paginas,
      data.ano,
      data.capaUrl ?? null
    );

    const livroExistente = await this.livroRepository.findById(id);

    if (!livroExistente) {
      throw new Error('Livro não encontrado.');
    }

    const autor = await this.autorRepository.findById(data.autorId);

    if (!autor) {
      throw new Error('Autor não encontrado.');
    }

    const categoria = await this.categoriaRepository.findById(data.categoriaId);

    if (!categoria) {
      throw new Error('Categoria não encontrada.');
    }

    const livroAtualizado = new Livro(
      data.titulo.trim(),
      data.autorId,
      data.categoriaId,
      data.paginas,
      data.ano,
      data.capaUrl?.trim() || null,
      id
    );

    return this.livroRepository.update(id, livroAtualizado);
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);

    const livro = await this.livroRepository.findById(id);

    if (!livro) {
      throw new Error('Livro não encontrado.');
    }

    await this.livroRepository.delete(id);
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID inválido.');
    }
  }

  private validatePagination(page: number, limit: number): void {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error('A página deve ser um número inteiro maior que zero.');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('O limite deve ser um número inteiro entre 1 e 100.');
    }
  }
}
