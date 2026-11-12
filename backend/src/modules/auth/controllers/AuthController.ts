
import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private readonly authService = new AuthService();

  // Responsável por receber e responder às requisições de login.
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.authService.login(req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Login realizado com sucesso!',
        token: result.token,
        user: result.user
      });

    } catch (error: unknown) {
      if (error instanceof Error) {
        const isValidationError =
          error.message === 'E-mail e senha são obrigatórios.' ||
          error.message === 'Informe um e-mail válido.';

        const isInvalidCredentials =
          error.message === 'E-mail ou senha inválidos.';

        if (isValidationError) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (isInvalidCredentials) {
          return res.status(401).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao realizar login:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao realizar login.'
      });
    }
  }
}
