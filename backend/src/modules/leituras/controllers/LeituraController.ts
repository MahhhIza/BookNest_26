import type { Request, Response } from 'express';
import { LeituraService } from '../services/LeituraService';

export class LeituraController {
  private leituraService: LeituraService;

  constructor() {
    this.leituraService = new LeituraService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const id = await this.leituraService.create(req.body);

      res.status(201).json({
        message: 'Leitura cadastrada com sucesso.',
        id
      });
    } catch (error) {
      const mensagem = error instanceof Error
        ? error.message
        : 'Erro ao cadastrar leitura.';

      if (mensagem.includes('Livro não encontrado')) {
        res.status(404).json({ message: mensagem });
        return;
      }

      if (
        mensagem.includes('deve') ||
        mensagem.includes('só pode') ||
        mensagem.includes('não é válida')
      ) {
        res.status(400).json({ message: mensagem });
        return;
      }

      res.status(500).json({
        message: 'Erro interno ao cadastrar leitura.'
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const resultado = await this.leituraService.findAll(page, limit);

      res.status(200).json(resultado);
    } catch (error) {
      const mensagem = error instanceof Error
        ? error.message
        : 'Erro ao listar leituras.';

      res.status(400).json({ message: mensagem });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      const leitura = await this.leituraService.findById(id);

      res.status(200).json(leitura);
    } catch (error) {
      const mensagem = error instanceof Error
        ? error.message
        : 'Erro ao consultar leitura.';

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ message: mensagem });
        return;
      }

      res.status(400).json({ message: mensagem });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      await this.leituraService.update(id, req.body);

      res.status(200).json({
        message: 'Leitura atualizada com sucesso.'
      });
    } catch (error) {
      const mensagem = error instanceof Error
        ? error.message
        : 'Erro ao atualizar leitura.';

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ message: mensagem });
        return;
      }

      if (mensagem.includes('Livro não encontrado')) {
        res.status(404).json({ message: mensagem });
        return;
      }

      res.status(400).json({ message: mensagem });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      await this.leituraService.delete(id);

      res.status(200).json({
        message: 'Leitura excluída com sucesso.'
      });
    } catch (error) {
      const mensagem = error instanceof Error
        ? error.message
        : 'Erro ao excluir leitura.';

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ message: mensagem });
        return;
      }

      res.status(400).json({ message: mensagem });
    }
  }
}