import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';
import { UserRepository } from '../modules/users/repositories/UserRepository';

const userRepository = new UserRepository();

export async function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (req.userId === undefined) {
    throw new UnauthorizedError();
  }

  const user = await userRepository.findById(req.userId);

  if (!user || user.getRole() !== 'admin') {
    throw new ForbiddenError('Apenas administradores podem fazer isso.');
  }

  next();
}
