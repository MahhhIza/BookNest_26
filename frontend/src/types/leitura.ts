export const STATUS_LEITURA = ["Quero ler", "Lendo", "Lido"] as const

export type StatusLeitura = (typeof STATUS_LEITURA)[number]
export type Leitura = { id: number; livroId: number; status: StatusLeitura; nota: number | null; concluidaEm: string | null }
export type LeituraInput = Omit<Leitura, "id">
