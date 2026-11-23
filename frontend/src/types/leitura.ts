export const STATUS_LEITURA = ["Quero ler", "Lendo", "Lido"] as const

export type StatusLeitura = (typeof STATUS_LEITURA)[number]

export interface Leitura {
  id: number
  livroId: number | null
  openLibraryId: string | null
  livroTitulo?: string
  livroCapaUrl?: string | null
  livroPaginas?: number | null
  status: StatusLeitura
  nota: number | null
  concluidaEm: string | null
}

export type LeituraInput = Omit<Leitura, "id" | "livroTitulo" | "livroCapaUrl" | "livroPaginas">
