
import { Categoria } from '../entities/Categoria';
import {
  CategoriaRepository,
  type PaginatedCategorias
} from '../repositories/CategoriaRepository';
import { CategoriaValidator } from '../validators/CategoriaValidator';

// Dados permitidos para cadastro.
interface CreateCategoriaDTO {
  nome: string;
  descricao: string;
}

// Dados permitidos para atualização.
interface UpdateCategoriaDTO {
  nome: string;
  descricao: string;
}

export class CategoriaService {
  private readonly categoriaRepository = new CategoriaRepository();

  // Cadastra uma nova categoria.
  async create(data: CreateCategoriaDTO): Promise<Categoria> {
    CategoriaValidator.validate(data.nome, data.descricao);

    const nome = data.nome.trim();
    const descricao = data.descricao.trim();

    const categoria = new Categoria(nome, descricao);

    return await this.categoriaRepository.create(categoria);
  }

  // Lista categorias com paginação.
  async findAll(
    page: number,
    limit: number
  ): Promise<PaginatedCategorias> {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error('A página deve ser um número inteiro maior que zero.');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('O limite deve estar entre 1 e 100.');
    }

    return await this.categoriaRepository.findAll(page, limit);
  }

  // Consulta uma categoria pelo ID.
  async findById(id: number): Promise<Categoria> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador de categoria inválido.');
    }

    const categoria = await this.categoriaRepository.findById(id);

    if (!categoria) {
      throw new Error('Categoria não encontrada.');
    }

    return categoria;
  }

  // Atualiza uma categoria existente.
  async update(
    id: number,
    data: UpdateCategoriaDTO
  ): Promise<Categoria> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador de categoria inválido.');
    }

    CategoriaValidator.validate(data.nome, data.descricao);

    const existingCategoria = await this.categoriaRepository.findById(id);

    if (!existingCategoria) {
      throw new Error('Categoria não encontrada.');
    }

    const categoria = new Categoria(
      data.nome.trim(),
      data.descricao.trim(),
      id
    );

    const updatedCategoria = await this.categoriaRepository.update(categoria);

    if (!updatedCategoria) {
      throw new Error('Não foi possível atualizar a categoria.');
    }

    return updatedCategoria;
  }

  // Exclui uma categoria existente.
  async delete(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador de categoria inválido.');
    }

    const existingCategoria = await this.categoriaRepository.findById(id);

    if (!existingCategoria) {
      throw new Error('Categoria não encontrada.');
    }

    const deleted = await this.categoriaRepository.delete(id);

    if (!deleted) {
      throw new Error('Não foi possível excluir a categoria.');
    }
  }
}
