
import database from '../../../config/database';
import { User } from '../entities/User';
import type { UserRole } from '../entities/User';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  cpf: string;
  role: UserRole;
}

export class UserRepository {
  private toEntity(row: UserRow): User {
    return new User(
      row.name,
      row.email,
      row.password_hash,
      row.cpf,
      row.id,
      row.role
    );
  }

  async create(user: User): Promise<User> {
    const [result] = await database.execute<ResultSetHeader>(
      `INSERT INTO users (name, email, password_hash, cpf, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user.getName(),
        user.getEmail(),
        user.getPasswordHash(),
        user.getCpf(),
        user.getRole()
      ]
    );

    return new User(
      user.getName(),
      user.getEmail(),
      user.getPasswordHash(),
      user.getCpf(),
      result.insertId,
      user.getRole()
    );
  }

  async update(user: User): Promise<void> {
    await database.execute(
      `UPDATE users SET name = ?, cpf = ?, password_hash = ? WHERE id = ?`,
      [
        user.getName(),
        user.getCpf(),
        user.getPasswordHash(),
        user.getId()
      ]
    );
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await database.execute<UserRow[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    return rows.length === 0 ? null : this.toEntity(rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await database.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    return rows.length === 0 ? null : this.toEntity(rows[0]);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const [rows] = await database.execute<UserRow[]>(
      'SELECT * FROM users WHERE cpf = ?',
      [cpf]
    );

    return rows.length === 0 ? null : this.toEntity(rows[0]);
  }
}
