
export class Categoria {
  private readonly id: number | null;
  private readonly nome: string;
  private readonly descricao: string;

  constructor(
    nome: string,
    descricao: string,
    id: number | null = null
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
  }

  getId(): number | null {
    return this.id;
  }

  getNome(): string {
    return this.nome;
  }

  getDescricao(): string {
    return this.descricao;
  }
}
