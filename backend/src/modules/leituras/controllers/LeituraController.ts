import type { Request, Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../../../errors/AppError';
import { lerPaginacao } from '../../../shared/utils/paginacao';
import { LeituraService } from '../services/LeituraService';

export class LeituraController {
  private readonly servico = new LeituraService();

  private usuarioId(req: Request): number {
    if (!req.userId) {
      throw new UnauthorizedError();
    }

    return req.userId;
  }

  private lerId(req: Request): number {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      throw new NotFoundError();
    }

    return id;
  }

  listar = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = lerPaginacao(req.query);

    res.status(200).json(
      await this.servico.listar(this.usuarioId(req), page, limit)
    );
  };

  buscar = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(
      await this.servico.buscar(this.usuarioId(req), this.lerId(req))
    );
  };

  criar = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(
      await this.servico.criar(this.usuarioId(req), req.body)
    );
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(
      await this.servico.atualizar(
        this.usuarioId(req),
        this.lerId(req),
        req.body
      )
    );
  };

  remover = async (req: Request, res: Response): Promise<void> => {
    await this.servico.remover(this.usuarioId(req), this.lerId(req));

    res.status(204).send();
  };
}
