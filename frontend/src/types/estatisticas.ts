export type LivrosPorCategoria = { categoria: string; livros: number }
export type FaixaDePaginas = { faixa: string; livros: number }
export type LeiturasPorMes = { mes: string; leituras: number }
export type PaginasPorNota = { paginas: number; nota: number }

export type Resumo = {
  totalLivros: number
  livrosLidos: number
  paginasLidas: number
  notaMedia: number | null
}

export type Estatisticas = {
  resumo: Resumo
  livrosPorCategoria: LivrosPorCategoria[]
  faixasDePaginas: FaixaDePaginas[]
  leiturasPorMes: LeiturasPorMes[]
  paginasPorNota: PaginasPorNota[]
}
