
export class Leitura {
  private readonly id: number | null;
  private readonly livroId: number;
  private readonly status: string;
  private readonly nota: number | null;
  private readonly concluidaEm: string | null;

  constructor(
    livroId: number,
    status: string,
    nota: number | null = null,
    concluidaEm: string | null = null,
    id: number | null = null
  ) {
    this.id = id;
    this.livroId = livroId;
    this.status = status;
    this.nota = nota;
    this.concluidaEm = concluidaEm;
  }

  getId(): number | null {
    return this.id;
  }

  getLivroId(): number {
    return this.livroId;
  }

  getStatus(): string {
    return this.status;
  }

  getNota(): number | null {
    return this.nota;
  }

  getConcluidaEm(): string | null {
    return this.concluidaEm;
  }
}
