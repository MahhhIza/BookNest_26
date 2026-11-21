
import bcrypt from 'bcryptjs';
import { getSaltRounds } from '../../../config/env';
import { ConflictError, NotFoundError, ValidationError } from '../../../errors/AppError';
import { User } from '../entities/User';
import type { UserRole } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserValidator } from '../validators/userValidator';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

interface UpdateUserDTO {
  name?: string;
  cpf?: string;
  password?: string;
}

export class UserService {
  private readonly userRepository = new UserRepository();

  async createUser(data: CreateUserDTO): Promise<User> {
    if (
      !data.name?.trim() ||
      !data.email?.trim() ||
      !data.password ||
      !data.cpf?.trim()
    ) {
      throw new ValidationError('Todos os campos são obrigatórios.');
    }

    const name = data.name.trim();
    if (name.split(/\s+/).length < 2) {
      throw new ValidationError('Informe seu nome e sobrenome.');
    }
    const email = data.email.trim().toLowerCase();
    const cpf = data.cpf.replace(/\D/g, '');

    UserValidator.validateEmail(email);
    UserValidator.validateCPF(cpf);
    UserValidator.validatePassword(data.password);

    const existingEmail = await this.userRepository.findByEmail(email);

    if (existingEmail) {
      throw new ConflictError('Este e-mail já está cadastrado.');
    }

    const existingCpf = await this.userRepository.findByCpf(cpf);

    if (existingCpf) {
      throw new ConflictError('Este CPF já está cadastrado.');
    }

    const passwordHash = await bcrypt.hash(data.password, getSaltRounds());

    const total = await this.userRepository.count();
    const role = total === 0 ? 'admin' : 'user';

    const user = new User(
      name,
      email,
      passwordHash,
      cpf,
      null,
      role
    );

    return await this.userRepository.create(user);
  }

  async listAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async changeRole(
    actorId: number,
    targetId: number,
    role: unknown
  ): Promise<User> {
    if (role !== 'admin' && role !== 'user') {
      throw new ValidationError('Papel inválido. Use "admin" ou "user".');
    }

    if (actorId === targetId) {
      throw new ValidationError(
        'Você não pode mudar o seu próprio papel.'
      );
    }

    const target = await this.getById(targetId);
    await this.userRepository.updateRole(targetId, role as UserRole);

    return await this.getById(target.getId() as number);
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return user;
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    const current = await this.getById(id);

    if (!data.name?.trim() || !data.cpf?.trim()) {
      throw new ValidationError('Todos os campos são obrigatórios.');
    }

    const name = data.name.trim();
    const cpf = data.cpf.replace(/\D/g, '');

    UserValidator.validateCPF(cpf);

    const sameCpf = await this.userRepository.findByCpf(cpf);

    if (sameCpf && sameCpf.getId() !== id) {
      throw new ConflictError('Este CPF já está cadastrado.');
    }

    let passwordHash = current.getPasswordHash();

    if (data.password) {
      UserValidator.validatePassword(data.password);
      passwordHash = await bcrypt.hash(data.password, getSaltRounds());
    }

    const updated = new User(
      name,
      current.getEmail(),
      passwordHash,
      cpf,
      id,
      current.getRole()
    );

    await this.userRepository.update(updated);

    return updated;
  }
}
