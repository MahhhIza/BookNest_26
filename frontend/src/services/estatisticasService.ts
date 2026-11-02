import type { Estatisticas } from "@/types/estatisticas"

const AMOSTRA: Estatisticas = {
  livrosPorCategoria: [
    { categoria: "Romance", livros: 14 },
    { categoria: "Ficção", livros: 11 },
    { categoria: "Fantasia", livros: 9 },
    { categoria: "Técnico", livros: 6 },
    { categoria: "Biografia", livros: 4 },
    { categoria: "Poesia", livros: 2 },
  ],
  leiturasPorMes: [
    { mes: "Jan", leituras: 2 },
    { mes: "Fev", leituras: 3 },
    { mes: "Mar", leituras: 2 },
    { mes: "Abr", leituras: 4 },
    { mes: "Mai", leituras: 3 },
    { mes: "Jun", leituras: 5 },
    { mes: "Jul", leituras: 6 },
    { mes: "Ago", leituras: 4 },
    { mes: "Set", leituras: 5 },
    { mes: "Out", leituras: 7 },
  ],
  paginasPorDias: [
    { dias: 4, paginas: 120 },
    { dias: 6, paginas: 190 },
    { dias: 7, paginas: 210 },
    { dias: 9, paginas: 280 },
    { dias: 10, paginas: 300 },
    { dias: 12, paginas: 350 },
    { dias: 14, paginas: 410 },
    { dias: 15, paginas: 380 },
    { dias: 18, paginas: 520 },
    { dias: 21, paginas: 600 },
    { dias: 25, paginas: 720 },
  ],
}

export function getEstatisticas(): Promise<Estatisticas> {
  return Promise.resolve(AMOSTRA)
}
