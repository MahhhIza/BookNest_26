
import type { Request, Response } from 'express';
import { LivroService } from '../services/LivroService';

export class LivroController {
  private readonly livroService: LivroService;

  constructor() {
    this.livroService = new LivroService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const livro = await this.livroService.create(req.body);

      res.status(201).json({
        status: 'success',
        message: 'Livro cadastrado com sucesso.',
        data: livro
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      if (
        message.includes('obrigatório') ||
        message.includes('máximo') ||
        message.includes('deve ser') ||
        message.includes('deve ter') ||
        message.includes('URL da capa') ||
        message.includes('quantidade de páginas') ||
        message.includes('O ano')
      ) {
        res.status(400).json({
          status: 'error',
          message
        });
        return;
      }

      if (message === 'Autor não encontrado.' ||
          message === 'Categoria não encontrada.') {
        res.status(404).json({
          status: 'error',
          message
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: 'Erro interno ao cadastrar livro.'
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const resultado = await this.livroService.findAll(page, limit);

      res.status(200).json({
        status: 'success',
        ...resultado
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      res.status(400).json({
        status: 'error',
        message
      });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const livro = await this.livroService.findById(id);

      res.status(200).json({
        status: 'success',
        data: livro
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      res.status(
        message === 'Livro não encontrado.' ? 404 : 400
      ).json({
        status: 'error',
        message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const livro = await this.livroService.update(id, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Livro atualizado com sucesso.',
        data: livro
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      if (
        message === 'Livro não encontrado.' ||
        message === 'Autor não encontrado.' ||
        message === 'Categoria não encontrada.'
      ) {
        res.status(404).json({
          status: 'error',
          message
        });
        return;
      }

      if (
        message.includes('obrigatório') ||
        message.includes('máximo') ||
        message.includes('deve ser') ||
        message.includes('deve ter') ||
        message.includes('URL da capa') ||
        message.includes('quantidade de páginas') ||
        message.includes('O ano')
      ) {
        res.status(400).json({
          status: 'error',
          message
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: 'Erro interno ao atualizar livro.'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      await this.livroService.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Livro excluído com sucesso.'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      if (message === 'Livro não encontrado.') {
        res.status(404).json({
          status: 'error',
          message
        });
        return;
      }

      if (message === 'ID inválido.') {
        res.status(400).json({
          status: 'error',
          message
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: 'Erro interno ao excluir livro.'
      });
    }
  }
}
