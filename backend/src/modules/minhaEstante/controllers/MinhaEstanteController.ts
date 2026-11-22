
import type { Request, Response } from 'express';
import { UnauthorizedError } from '../../../errors/AppError';
import { MinhaEstanteService } from '../services/MinhaEstanteService';

export class MinhaEstanteController {
  private readonly service = new MinhaEstanteService();

  private obterUsuarioId(req: Request): number {
    if (typeof req.userId !== 'number') {
      throw new UnauthorizedError('Usuário não autenticado.');
    }

    return req.userId;
  }

  listar = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = this.obterUsuarioId(req);

    const livros = await this.service.listar(usuarioId);

    res.status(200).json({
      data: livros
    });
  };

  adicionar = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = this.obterUsuarioId(req);

    const livro = await this.service.adicionar(usuarioId, req.body);

    res.status(201).json({
      message: 'Livro adicionado à sua estante.',
      data: livro
    });
  };

  remover = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = this.obterUsuarioId(req);
    const id = Number(req.params.id);

    await this.service.remover(id, usuarioId);

    res.status(204).send();
  };
}
