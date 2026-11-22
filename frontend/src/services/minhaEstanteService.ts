
import { api } from "@/services/api"
import type { LivroEncontrado } from "@/services/openLibraryService"

export interface LivroMinhaEstante extends LivroEncontrado {
  id: number
  usuarioId: number
  createdAt: string | null
}

interface ListaMinhaEstante {
  data: LivroMinhaEstante[]
}

interface RespostaMinhaEstante {
  message: string
  data: LivroMinhaEstante
}

export const minhaEstanteService = {
  async listar(): Promise<LivroMinhaEstante[]> {
    const { data } = await api.get<ListaMinhaEstante>(
      "/minha-estante"
    )

    return data.data
  },

  async adicionar(
    livro: LivroEncontrado
  ): Promise<LivroMinhaEstante> {
    const { data } = await api.post<RespostaMinhaEstante>(
      "/minha-estante",
      livro
    )

    return data.data
  },

  async remover(id: number): Promise<void> {
    await api.delete(`/minha-estante/${id}`)
  },
}
