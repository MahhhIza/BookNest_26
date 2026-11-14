
export class Livro {
  private readonly id: number | null;
  private readonly titulo: string;
  private readonly autorId: number;
  private readonly categoriaId: number;
  private readonly paginas: number;
  private readonly ano: number;
  private readonly capaUrl: string | null;

  constructor(
    titulo: string,
    autorId: number,
    categoriaId: number,
    paginas: number,
    ano: number,
    capaUrl: string | null = null,
    id: number | null = null
  ) {
    this.id = id;
    this.titulo = titulo;
    this.autorId = autorId;
    this.categoriaId = categoriaId;
    this.paginas = paginas;
    this.ano = ano;
    this.capaUrl = capaUrl;
  }

  getId(): number | null {
    return this.id;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getAutorId(): number {
    return this.autorId;
  }

  getCategoriaId(): number {
    return this.categoriaId;
  }

  getPaginas(): number {
    return this.paginas;
  }

  getAno(): number {
    return this.ano;
  }

  getCapaUrl(): string | null {
    return this.capaUrl;
  }
}
