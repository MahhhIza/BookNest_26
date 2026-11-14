
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../../users/entities/User';

// Verifica se o usuário possui um token JWT válido.
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      status: 'error',
      message: 'Token de autenticação não informado.'
    });
    return;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({
      status: 'error',
      message: 'Formato do token inválido.'
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET não está configurada.');

    res.status(500).json({
      status: 'error',
      message: 'Erro interno de configuração da autenticação.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    // Confirma se o token contém ID e papel válidos.
    if (
      typeof decoded === 'string' ||
      typeof decoded.sub !== 'string' ||
      !['admin', 'user'].includes(String(decoded.role))
    ) {
      res.status(401).json({
        status: 'error',
        message: 'Token de autenticação inválido.'
      });
      return;
    }

    const userId = Number(decoded.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(401).json({
        status: 'error',
        message: 'Token de autenticação inválido.'
      });
      return;
    }

    // Disponibiliza o ID e o papel para os próximos middlewares.
    res.locals.userId = userId;
    res.locals.userRole = decoded.role as UserRole;

    next();
  } catch {
    res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado.'
    });
  }
}

// Permite a operação somente para administradores.
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.locals.userRole !== 'admin') {
    res.status(403).json({
      status: 'error',
      message: 'Você não tem permissão para realizar esta operação.'
    });
    return;
  }

  next();
}
