import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { getJwtExpiresIn, getJwtSecret } from '../../../config/env';
import { UnauthorizedError, ValidationError } from '../../../errors/AppError';
import type { PublicUser } from '../../users/entities/User';
import { UserRepository } from '../../users/repositories/UserRepository';

interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: PublicUser;
}

export class AuthService {
  private readonly userRepository = new UserRepository();

  async login(data: LoginDTO): Promise<LoginResult> {
    if (!data.email?.trim() || !data.password) {
      throw new ValidationError('Informe e-mail e senha.');
    }

    const user = await this.userRepository.findByEmail(
      data.email.trim().toLowerCase()
    );

    const passwordOk =
      user !== null &&
      (await bcrypt.compare(data.password, user.getPasswordHash()));

    if (!user || !passwordOk) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    const token = jwt.sign({ id: user.getId() }, getJwtSecret(), {
      expiresIn: getJwtExpiresIn() as SignOptions['expiresIn']
    });

    return { token, user: user.toPublic() };
  }
}
