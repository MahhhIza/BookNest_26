import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private readonly authService = new AuthService();

  async login(req: Request, res: Response): Promise<void> {
    const result = await this.authService.login(req.body ?? {});

    res.status(200).json(result);
  }
}
