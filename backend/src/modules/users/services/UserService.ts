
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserValidator } from '../validators/userValidator';

// Define os dados recebidos no cadastro.
interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

// Define os dados permitidos na atualização do perfil.
interface UpdateUserDTO {
  name: string;
  password: string;
  cpf: string;
}

export class UserService {
  private readonly userRepository = new UserRepository();

  // Responsável pelas regras de negócio do cadastro.
  async createUser(data: CreateUserDTO): Promise<User> {
    if (
      !data.name?.trim() ||
      !data.email?.trim() ||
      !data.password ||
      !data.cpf?.trim()
    ) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const cpf = data.cpf.replace(/\D/g, '');

    UserValidator.validateEmail(email);
    UserValidator.validateCPF(cpf);
    UserValidator.validatePassword(data.password);

    const existingEmail = await this.userRepository.findByEmail(email);

    if (existingEmail) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const existingCpf = await this.userRepository.findByCpf(cpf);

    if (existingCpf) {
      throw new Error('Este CPF já está cadastrado.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = new User(name, email, passwordHash, cpf);

    return await this.userRepository.create(user);
  }

  // Consulta o perfil do usuário autenticado.
  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return user;
  }

  // Atualiza os dados do próprio perfil.
  async updateProfile(
    userId: number,
    data: UpdateUserDTO
  ): Promise<User> {
    if (
      !data.name?.trim() ||
      !data.password ||
      !data.cpf?.trim()
    ) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    const currentUser = await this.userRepository.findById(userId);

    if (!currentUser) {
      throw new Error('Usuário não encontrado.');
    }

    const name = data.name.trim();
    const cpf = data.cpf.replace(/\D/g, '');

    UserValidator.validateCPF(cpf);
    UserValidator.validatePassword(data.password);

    const existingCpf = await this.userRepository.findByCpf(cpf);

    if (
      existingCpf &&
      existingCpf.getId() !== currentUser.getId()
    ) {
      throw new Error('Este CPF já está cadastrado.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const updatedUser = new User(
      name,
      currentUser.getEmail(),
      passwordHash,
      cpf,
      currentUser.getId()
    );

    const result = await this.userRepository.update(updatedUser);

    if (!result) {
      throw new Error('Não foi possível atualizar o perfil.');
    }

    return result;
  }
}
