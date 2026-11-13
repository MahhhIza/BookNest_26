
import type { Request, Response } from 'express';
import { UnauthorizedError } from '../../../errors/AppError';
import { UserService } from '../services/UserService';

export class UserController {
  private readonly userService = new UserService();

  async create(req: Request, res: Response): Promise<void> {
    const user = await this.userService.createUser(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Usuário cadastrado com sucesso!',
      id: user.getId(),
      user: user.toPublic()
    });
  }

  async me(req: Request, res: Response): Promise<void> {
    const user = await this.userService.getById(this.currentUserId(req));

    res.status(200).json({ user: user.toPublic() });
  }

  async updateMe(req: Request, res: Response): Promise<void> {
    const user = await this.userService.updateUser(
      this.currentUserId(req),
      req.body
    );

    res.status(200).json({ user: user.toPublic() });
  }

  private currentUserId(req: Request): number {
    if (req.userId === undefined) {
      throw new UnauthorizedError();
    }

    return req.userId;
  }
}
