
export type UserRole = 'admin' | 'user';

export class User {
  private readonly id: number | null;
  private readonly name: string;
  private readonly email: string;
  private readonly passwordHash: string;
  private readonly cpf: string;
  private readonly role: UserRole;

  constructor(
    name: string,
    email: string,
    passwordHash: string,
    cpf: string,
    id: number | null = null,
    role: UserRole = 'admin'
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.cpf = cpf;
    this.role = role;
  }

  public getId(): number | null {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getCpf(): string {
    return this.cpf;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public toPublic(): PublicUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      role: this.role
    };
  }
}

export interface PublicUser {
  id: number | null;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
}
