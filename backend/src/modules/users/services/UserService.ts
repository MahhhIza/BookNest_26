
import bcrypt from 'bcryptjs';
import { getSaltRounds } from '../../../config/env';
import { ConflictError, NotFoundError, ValidationError } from '../../../errors/AppError';
import { User } from '../entities/User';
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

    const user = new User(
      name,
      email,
      passwordHash,
      cpf
    );

    return await this.userRepository.create(user);
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
