
import type { Request, Response } from 'express';
import { ValidationError } from '../../errors/AppError';
import { OpenLibraryService } from './OpenLibraryService';

export class OpenLibraryController {
  private readonly servico = new OpenLibraryService();

  pesquisar = async (req: Request, res: Response): Promise<void> => {
    const termo = req.query.q;
    const limiteQuery = req.query.limite;

    if (typeof termo !== 'string') {
      throw new ValidationError(
        'Informe o termo de pesquisa no parâmetro q.'
      );
    }

    let limite = 10;

    if (limiteQuery !== undefined) {
      if (
        typeof limiteQuery !== 'string' ||
        !/^\d+$/.test(limiteQuery)
      ) {
        throw new ValidationError(
          'O limite deve ser um número inteiro positivo.'
        );
      }

      limite = Number(limiteQuery);
    }

    const resultado = await this.servico.pesquisar(termo, limite);

    res.status(200).json(resultado);
  };
}
