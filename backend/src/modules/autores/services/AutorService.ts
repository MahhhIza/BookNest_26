
import { Autor } from '../entities/Autor';
import { AutorRepository, type PaginatedAutores } from '../repositories/AutorRepository';
import { AutorValidator } from '../validators/AutorValidator';

// Dados permitidos para cadastro.
interface CreateAutorDTO {
  nome: string;
  nacionalidade: string;
}

// Dados permitidos para atualização.
interface UpdateAutorDTO {
  nome: string;
  nacionalidade: string;
}

export class AutorService {
  private readonly autorRepository = new AutorRepository();

  // Cadastra um novo autor.
  async create(data: CreateAutorDTO): Promise<Autor> {
    AutorValidator.validate(data.nome, data.nacionalidade);

    const nome = data.nome.trim();
    const nacionalidade = data.nacionalidade.trim();

    const autor = new Autor(nome, nacionalidade);

    return await this.autorRepository.create(autor);
  }

  // Lista autores com paginação.
  async findAll(
    page: number,
    limit: number
  ): Promise<PaginatedAutores> {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error('A página deve ser um número inteiro maior que zero.');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('O limite deve estar entre 1 e 100.');
    }

    return await this.autorRepository.findAll(page, limit);
  }

  // Consulta um autor pelo ID.
  async findById(id: number): Promise<Autor> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador de autor inválido.');
    }

    const autor = await this.autorRepository.findById(id);

    if (!autor) {
      throw new Error('Autor não encontrado.');
    }

    return autor;
  }

  // Atualiza um autor existente.
  async update(id: number, data: UpdateAutorDTO): Promise<Autor> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador de autor inválido.');
    }

    AutorValidator.validate(data.nome, data.nacionalidade);

    const existingAutor = await this.autorRepository.findById(id);

    if (!existingAutor) {
      throw new Error('Autor não encontrado.');
    }

    const autor = new Autor(
      data.nome.trim(),
      data.nacionalidade.trim(),
      id
    );

    const updatedAutor = await this.autorRepository.update(autor);

    if (!updatedAutor) {
      throw new Error('Não foi possível atualizar o autor.');
    }

    return updatedAutor;
  }

  // Exclui um autor existente.
  async delete(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador de autor inválido.');
    }

    const existingAutor = await this.autorRepository.findById(id);

    if (!existingAutor) {
      throw new Error('Autor não encontrado.');
    }

    const deleted = await this.autorRepository.delete(id);

    if (!deleted) {
      throw new Error('Não foi possível excluir o autor.');
    }
  }
}
