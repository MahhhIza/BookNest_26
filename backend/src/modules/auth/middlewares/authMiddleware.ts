
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Verifica se o usuário possui um token JWT válido.
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  // Verifica se o cabeçalho foi enviado.
  if (!authorization) {
    res.status(401).json({
      status: 'error',
      message: 'Token de autenticação não informado.'
    });
    return;
  }

  // Verifica o formato Bearer do token.
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({
      status: 'error',
      message: 'Formato do token inválido.'
    });
    return;
  }

  // Recupera a chave secreta do ambiente.
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
    // Verifica a assinatura e a validade do token.
    const decoded = jwt.verify(token, secret);

    // Confirma que o token possui um identificador de usuário.
    if (
      typeof decoded === 'string' ||
      typeof decoded.sub !== 'string'
    ) {
      res.status(401).json({
        status: 'error',
        message: 'Token de autenticação inválido.'
      });
      return;
    }

    // Disponibiliza o ID para os próximos controladores.
    res.locals.userId = Number(decoded.sub);

    next();
  } catch {
    res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado.'
    });
  }
}
