import type { Request, Response } from 'express';
import { NotFoundError } from '../../errors/AppError';
import type { BaseService } from '../services/BaseService';
import { lerPaginacao } from '../utils/paginacao';

export class BaseController<T extends { id: number }, TInput> {
  constructor(private readonly servico: BaseService<T, TInput>) {}

  listar = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = lerPaginacao(req.query);

    res.status(200).json(await this.servico.listar(page, limit));
  };

  buscar = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(await this.servico.buscar(this.lerId(req)));
  };

  criar = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.servico.criar(req.body));
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .json(await this.servico.atualizar(this.lerId(req), req.body));
  };

  remover = async (req: Request, res: Response): Promise<void> => {
    await this.servico.remover(this.lerId(req));

    res.status(204).send();
  };

  private lerId(req: Request): number {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      throw new NotFoundError();
    }

    return id;
  }
}
