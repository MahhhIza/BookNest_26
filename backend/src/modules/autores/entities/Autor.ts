
export class Autor {
  // Atributos privados: protegidos contra acesso direto.
  private readonly id: number | null;
  private readonly nome: string;
  private readonly nacionalidade: string;

  constructor(
    nome: string,
    nacionalidade: string,
    id: number | null = null
  ) {
    this.id = id;
    this.nome = nome;
    this.nacionalidade = nacionalidade;
  }

  // Retorna o identificador do autor.
  getId(): number | null {
    return this.id;
  }

  // Retorna o nome do autor.
  getNome(): string {
    return this.nome;
  }

  // Retorna a nacionalidade do autor.
  getNacionalidade(): string {
    return this.nacionalidade;
  }
}
