
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../users/repositories/UserRepository';
import { UserValidator } from '../../users/validators/userValidator';

// Define os dados recebidos no login.
interface LoginDTO {
  email: string;
  password: string;
}

// Define os dados devolvidos após o login.
interface LoginResult {
  token: string;
  user: {
    id: number | null;
    name: string;
    email: string;
  };
}

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository ?? new UserRepository();
  }

  // Responsável pelas regras de negócio da autenticação.
  async login(data: LoginDTO): Promise<LoginResult> {

    // Verifica se os campos foram preenchidos.
    if (!data.email?.trim() || !data.password) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    // Normaliza o e-mail.
    const email = data.email.trim().toLowerCase();

    // Valida o formato do e-mail.
    UserValidator.validateEmail(email);

    // Procura o usuário cadastrado.
    const user = await this.userRepository.findByEmail(email);

    // Não revela se o e-mail ou a senha estão incorretos.
    if (!user) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // Compara a senha informada com o hash armazenado.
    const passwordMatches = await bcrypt.compare(
      data.password,
      user.getPasswordHash()
    );

    if (!passwordMatches) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // Verifica se a chave JWT está configurada.
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('A chave JWT não está configurada.');
    }

    // Gera o token de autenticação.
    const token = jwt.sign(
      { sub: String(user.getId()) },
      secret,
      { expiresIn: '2h' }
    );

    // Retorna o token e os dados públicos do usuário.
    return {
      token,
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail()
      }
    };
  }
}
