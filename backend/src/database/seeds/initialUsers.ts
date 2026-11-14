
import bcrypt from 'bcryptjs';
import database from '../../config/database';

// Representa uma conta que será cadastrada inicialmente.
interface InitialUser {
  name: string;
  email: string;
  password: string;
  cpf: string;
  role: 'admin' | 'user';
}

// Lê as configurações das contas iniciais do arquivo .env.
const initialUsers: InitialUser[] = [
  {
    name: process.env.SEED_ADMIN_NAME || '',
    email: process.env.SEED_ADMIN_EMAIL || '',
    password: process.env.SEED_ADMIN_PASSWORD || '',
    cpf: process.env.SEED_ADMIN_CPF || '',
    role: 'admin'
  },
  {
    name: process.env.SEED_VALEN_NAME || '',
    email: process.env.SEED_VALEN_EMAIL || '',
    password: process.env.SEED_VALEN_PASSWORD || '',
    cpf: process.env.SEED_VALEN_CPF || '',
    role: 'user'
  },
  {
    name: process.env.SEED_SOLANO_NAME || '',
    email: process.env.SEED_SOLANO_EMAIL || '',
    password: process.env.SEED_SOLANO_PASSWORD || '',
    cpf: process.env.SEED_SOLANO_CPF || '',
    role: 'user'
  }
];

// Cadastra as contas iniciais quando a configuração permitir.
async function seedInitialUsers(): Promise<void> {
  if (process.env.SEED_INITIAL_USERS !== 'true') {
    console.log('[SEED] Cadastro inicial desativado.');
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[SEED] O cadastro inicial não pode ser executado em produção.'
    );
  }

  for (const user of initialUsers) {
    const { name, email, password, cpf, role } = user;

    // Impede o cadastro com configurações incompletas.
    if (!name || !email || !password || !cpf) {
      throw new Error(
        `[SEED] Configuração incompleta para a conta ${role}.`
      );
    }

    // Verifica se o e-mail já está cadastrado.
    const [existingUsers] = await database.execute(
      'SELECT id, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    const existing = (existingUsers as Array<{
      id: number;
      role: string;
    }>)[0];

    if (existing) {
      if (existing.role !== role) {
        console.warn(
          `[SEED] A conta ${email} já existe com um papel diferente. Nenhuma alteração foi realizada.`
        );
      } else {
        console.log(`[SEED] Conta já existente: ${email}`);
      }

      continue;
    }

    // Evita tentar cadastrar um CPF já utilizado por outra conta.
    const [existingCpfs] = await database.execute(
      'SELECT id FROM users WHERE cpf = ? LIMIT 1',
      [cpf]
    );

    if ((existingCpfs as Array<{ id: number }>).length > 0) {
      throw new Error(
        `[SEED] O CPF configurado para ${email} já pertence a outra conta.`
      );
    }

    // Criptografa a senha antes de armazená-la.
    const passwordHash = await bcrypt.hash(password, 12);

    // Insere a conta no banco de dados.
    await database.execute(
      `INSERT INTO users (name, email, password_hash, cpf, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, cpf, role]
    );

    console.log(`[SEED] Conta inicial cadastrada: ${email}`);
  }

  console.log('[SEED] Verificação das contas iniciais concluída.');
}

export default seedInitialUsers;
