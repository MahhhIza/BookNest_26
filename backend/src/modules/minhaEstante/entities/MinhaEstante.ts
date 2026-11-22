
export interface MinhaEstante {
  id: number;
  usuarioId: number;
  openLibraryId: string;
  titulo: string;
  autores: string[];
  assuntos: string[];
  anoPublicacao: number | null;
  paginas: number | null;
  capaUrl: string | null;
  isbn: string | null;
  createdAt: string | null;
}

export interface MinhaEstanteInput {
  openLibraryId: string;
  titulo: string;
  autores: string[];
  assuntos: string[];
  anoPublicacao: number | null;
  paginas: number | null;
  capaUrl: string | null;
  isbn: string | null;
}
