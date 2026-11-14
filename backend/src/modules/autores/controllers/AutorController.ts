
import type { Request, Response } from 'express';
import { AutorService } from '../services/AutorService';

export class AutorController {
  private readonly autorService = new AutorService();

  // Cadastra um novo autor.
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const autor = await this.autorService.create(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Autor cadastrado com sucesso!',
        data: {
          id: autor.getId(),
          nome: autor.getNome(),
          nacionalidade: autor.getNacionalidade()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const isValidationError =
          error.message === 'Nome e nacionalidade são obrigatórios.' ||
          error.message === 'O nome deve ter no máximo 150 caracteres.' ||
          error.message === 'A nacionalidade deve ter no máximo 100 caracteres.';

        if (isValidationError) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao cadastrar autor:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao cadastrar autor.'
      });
    }
  }

  // Lista autores com paginação.
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await this.autorService.findAll(page, limit);

      return res.status(200).json({
        status: 'success',
        message: 'Autores consultados com sucesso!',
        data: result.data.map((autor) => ({
          id: autor.getId(),
          nome: autor.getNome(),
          nacionalidade: autor.getNacionalidade()
        })),
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const isPaginationError =
          error.message.startsWith('A página deve') ||
          error.message.startsWith('O limite deve');

        if (isPaginationError) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao consultar autores:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao consultar autores.'
      });
    }
  }

  // Consulta um autor pelo ID.
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const autor = await this.autorService.findById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Autor consultado com sucesso!',
        data: {
          id: autor.getId(),
          nome: autor.getNome(),
          nacionalidade: autor.getNacionalidade()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Identificador de autor inválido.') {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (error.message === 'Autor não encontrado.') {
          return res.status(404).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao consultar autor:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao consultar autor.'
      });
    }
  }

  // Atualiza um autor existente.
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const autor = await this.autorService.update(id, req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Autor atualizado com sucesso!',
        data: {
          id: autor.getId(),
          nome: autor.getNome(),
          nacionalidade: autor.getNacionalidade()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Identificador de autor inválido.') {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (
          error.message === 'Nome e nacionalidade são obrigatórios.' ||
          error.message === 'O nome deve ter no máximo 150 caracteres.' ||
          error.message === 'A nacionalidade deve ter no máximo 100 caracteres.'
        ) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (error.message === 'Autor não encontrado.') {
          return res.status(404).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao atualizar autor:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao atualizar autor.'
      });
    }
  }

  // Exclui um autor existente.
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      await this.autorService.delete(id);

      return res.status(200).json({
        status: 'success',
        message: 'Autor excluído com sucesso!'
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Identificador de autor inválido.') {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (error.message === 'Autor não encontrado.') {
          return res.status(404).json({
            status: 'error',
            message: error.message
          });
        }

        // O autor não pode ser excluído se possuir livros relacionados.
        if (
          error.message.includes('foreign key constraint fails') ||
          error.message.includes('Cannot delete or update a parent row')
        ) {
          return res.status(409).json({
            status: 'error',
            message: 'Não é possível excluir este autor porque existem livros associados a ele.'
          });
        }
      }

      console.error('Erro interno ao excluir autor:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao excluir autor.'
      });
    }
  }
}
