
export class User {
  // Atributos privados: não podem ser acessados diretamente de fora da classe.
  private readonly id: number | null;
  private readonly name: string;
  private readonly email: string;
  private readonly passwordHash: string;
  private readonly cpf: string;

  // Construtor: inicializa as propriedades do usuário.
  constructor(
    name: string,
    email: string,
    passwordHash: string,
    cpf: string,
    id: number | null = null
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.cpf = cpf;
  }

  // Getters: permitem consultar os dados sem alterar os atributos.
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
}
