
import type { Request, Response } from 'express';
import { CategoriaService } from '../services/CategoriaService';

export class CategoriaController {
  private readonly categoriaService = new CategoriaService();

  // Cadastra uma nova categoria.
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const categoria = await this.categoriaService.create(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Categoria cadastrada com sucesso!',
        data: {
          id: categoria.getId(),
          nome: categoria.getNome(),
          descricao: categoria.getDescricao()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const isValidationError =
          error.message === 'Nome e descrição são obrigatórios.' ||
          error.message === 'O nome deve ter no máximo 150 caracteres.';

        if (isValidationError) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao cadastrar categoria:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao cadastrar categoria.'
      });
    }
  }

  // Lista categorias com paginação.
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await this.categoriaService.findAll(page, limit);

      return res.status(200).json({
        status: 'success',
        message: 'Categorias consultadas com sucesso!',
        data: result.data.map((categoria) => ({
          id: categoria.getId(),
          nome: categoria.getNome(),
          descricao: categoria.getDescricao()
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

      console.error('Erro interno ao consultar categorias:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao consultar categorias.'
      });
    }
  }

  // Consulta uma categoria pelo ID.
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const categoria = await this.categoriaService.findById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Categoria consultada com sucesso!',
        data: {
          id: categoria.getId(),
          nome: categoria.getNome(),
          descricao: categoria.getDescricao()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Identificador de categoria inválido.') {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (error.message === 'Categoria não encontrada.') {
          return res.status(404).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao consultar categoria:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao consultar categoria.'
      });
    }
  }

  // Atualiza uma categoria existente.
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const categoria = await this.categoriaService.update(id, req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Categoria atualizada com sucesso!',
        data: {
          id: categoria.getId(),
          nome: categoria.getNome(),
          descricao: categoria.getDescricao()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Identificador de categoria inválido.') {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (
          error.message === 'Nome e descrição são obrigatórios.' ||
          error.message === 'O nome deve ter no máximo 150 caracteres.'
        ) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (error.message === 'Categoria não encontrada.') {
          return res.status(404).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao atualizar categoria:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao atualizar categoria.'
      });
    }
  }

  // Exclui uma categoria existente.
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      await this.categoriaService.delete(id);

      return res.status(200).json({
        status: 'success',
        message: 'Categoria excluída com sucesso!'
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Identificador de categoria inválido.') {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (error.message === 'Categoria não encontrada.') {
          return res.status(404).json({
            status: 'error',
            message: error.message
          });
        }

        // A categoria não pode ser excluída se possuir livros relacionados.
        if (
          error.message.includes('foreign key constraint fails') ||
          error.message.includes('Cannot delete or update a parent row')
        ) {
          return res.status(409).json({
            status: 'error',
            message: 'Não é possível excluir esta categoria porque existem livros associados a ela.'
          });
        }
      }

      console.error('Erro interno ao excluir categoria:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao excluir categoria.'
      });
    }
  }
}
