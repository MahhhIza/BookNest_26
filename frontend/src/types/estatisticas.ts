export type LivrosPorCategoria = { categoria: string; livros: number }
export type LeiturasPorMes = { mes: string; leituras: number }
export type PaginasPorDias = { dias: number; paginas: number }

export type Estatisticas = {
  livrosPorCategoria: LivrosPorCategoria[]
  leiturasPorMes: LeiturasPorMes[]
  paginasPorDias: PaginasPorDias[]
}
