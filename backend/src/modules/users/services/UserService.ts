
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

// Define os dados recebidos no cadastro.
interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export class UserService {
  private readonly userRepository = new UserRepository();

  // Responsável pelas regras de negócio do cadastro.
  async createUser(data: CreateUserDTO): Promise<User> {

    // Verifica se todos os campos foram preenchidos.
    if (
      !data.name?.trim() ||
      !data.email?.trim() ||
      !data.password ||
      !data.cpf?.trim()
    ) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    // Normaliza os dados recebidos.
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const cpf = data.cpf.replace(/\D/g, '');

    // Verifica se já existe um usuário com esse e-mail.
    const existingEmail = await this.userRepository.findByEmail(email);

    if (existingEmail) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    // Verifica se já existe um usuário com esse CPF.
    const existingCpf = await this.userRepository.findByCpf(cpf);

    if (existingCpf) {
      throw new Error('Este CPF já está cadastrado.');
    }

    // Criptografa a senha antes de armazená-la.
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Cria a entidade do usuário com a senha protegida.
    const user = new User(
      name,
      email,
      passwordHash,
      cpf
    );

    // Solicita ao repositório que salve o usuário.
    return await this.userRepository.create(user);
  }
}
