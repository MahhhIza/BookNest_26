
import database from '../../../config/database';
import { User } from '../entities/User';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

// Define o formato dos dados que serão retornados pelo MySQL.
interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  cpf: string;
}

export class UserRepository {

  // Cadastra um usuário no banco de dados.
  async create(user: User): Promise<User> {
    const [result] = await database.execute<ResultSetHeader>(
      `INSERT INTO users (name, email, password_hash, cpf)
       VALUES (?, ?, ?, ?)`,
      [
        user.getName(),
        user.getEmail(),
        user.getPasswordHash(),
        user.getCpf()
      ]
    );

    // Retorna o usuário com o ID gerado pelo MySQL.
    return new User(
      user.getName(),
      user.getEmail(),
      user.getPasswordHash(),
      user.getCpf(),
      result.insertId
    );
  }

  // Busca um usuário pelo e-mail.
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await database.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return new User(
      user.name,
      user.email,
      user.password_hash,
      user.cpf,
      user.id
    );
  }

  // Busca um usuário pelo CPF.
  async findByCpf(cpf: string): Promise<User | null> {
    const [rows] = await database.execute<UserRow[]>(
      'SELECT * FROM users WHERE cpf = ?',
      [cpf]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return new User(
      user.name,
      user.email,
      user.password_hash,
      user.cpf,
      user.id
    );
  }
}
