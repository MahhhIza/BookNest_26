import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {})
    });
    return;
  }

  console.error('Erro interno:', error);

  res.status(500).json({ message: 'Erro interno do servidor.' });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Rota não encontrada.' });
}
