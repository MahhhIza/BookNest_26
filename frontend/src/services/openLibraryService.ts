
import { api } from "@/services/api"

export interface LivroEncontrado {
  openLibraryId: string
  titulo: string
  autores: string[]
  assuntos: string[]
  anoPublicacao: number | null
  paginas: number | null
  capaUrl: string | null
  isbn: string | null
}

interface PesquisaOpenLibrary {
  total: number
  resultados: LivroEncontrado[]
}

export async function pesquisarLivros(
  termo: string,
  limite = 5
): Promise<PesquisaOpenLibrary> {
  const { data } = await api.get<PesquisaOpenLibrary>(
    "/livros/pesquisar",
    {
      params: {
        q: termo.trim(),
        limite,
      },
    }
  )

  return data
}
