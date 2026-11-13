
import type { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private readonly userService = new UserService();

  // Realiza o cadastro de um novo usuário.
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.createUser(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Usuário cadastrado com sucesso!',
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          cpf: user.getCpf()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const isDuplicate =
          error.message === 'Este e-mail já está cadastrado.' ||
          error.message === 'Este CPF já está cadastrado.';

        const isValidationError =
          error.message === 'Todos os campos são obrigatórios.' ||
          error.message === 'Informe um e-mail válido.' ||
          error.message === 'O CPF deve conter 11 dígitos.' ||
          error.message === 'Informe um CPF válido.' ||
          error.message.startsWith('A senha deve ter');

        if (isDuplicate) {
          return res.status(409).json({
            status: 'error',
            message: error.message
          });
        }

        if (isValidationError) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao cadastrar usuário:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao cadastrar usuário.'
      });
    }
  }

  // Consulta o perfil do usuário autenticado.
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as number;

      const user = await this.userService.getProfile(userId);

      return res.status(200).json({
        status: 'success',
        message: 'Perfil consultado com sucesso!',
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          cpf: user.getCpf()
        }
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === 'Usuário não encontrado.'
      ) {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }

      console.error('Erro interno ao consultar perfil:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao consultar perfil.'
      });
    }
  }

  // Atualiza o perfil do usuário autenticado.
  async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as number;

      const user = await this.userService.updateProfile(userId, req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Perfil atualizado com sucesso!',
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          cpf: user.getCpf()
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const isDuplicate = error.message === 'Este CPF já está cadastrado.';

        const isValidationError =
          error.message === 'Todos os campos são obrigatórios.' ||
          error.message === 'O CPF deve conter 11 dígitos.' ||
          error.message === 'Informe um CPF válido.' ||
          error.message.startsWith('A senha deve ter');

        if (isDuplicate) {
          return res.status(409).json({
            status: 'error',
            message: error.message
          });
        }

        if (isValidationError) {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }

        if (error.message === 'Usuário não encontrado.') {
          return res.status(404).json({
            status: 'error',
            message: error.message
          });
        }
      }

      console.error('Erro interno ao atualizar perfil:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao atualizar perfil.'
      });
    }
  }
}
