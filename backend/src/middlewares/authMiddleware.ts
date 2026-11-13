import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/env';
import { UnauthorizedError } from '../errors/AppError';

interface TokenPayload {
  id: number;
}

function isTokenPayload(value: unknown): value is TokenPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'number'
  );
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token não informado.');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (!isTokenPayload(payload)) {
      throw new UnauthorizedError('Token inválido.');
    }

    req.userId = payload.id;
    next();
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError('Token inválido ou expirado.');
  }
}
