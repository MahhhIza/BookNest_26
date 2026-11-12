import { describe, expect, it } from "vitest"
import type { Leitura } from "@/types/leitura"
import type { Livro } from "@/types/livro"
import { calcularResumo, contarPorCategoria, faixasDePaginas, leiturasPorMes } from "./estatisticas"

const livros: Livro[] = [
  { id: 1, titulo: "A", autorId: 1, categoriaId: 1, paginas: 90, ano: 2000 },
  { id: 2, titulo: "B", autorId: 1, categoriaId: 1, paginas: 350, ano: 2001 },
  { id: 3, titulo: "C", autorId: 2, categoriaId: 2, paginas: 800, ano: 2002 },
]

const leituras: Leitura[] = [
  { id: 1, livroId: 1, status: "Lido", nota: 5, concluidaEm: "2026-01-10" },
  { id: 2, livroId: 2, status: "Lido", nota: 3, concluidaEm: "2026-03-05" },
  { id: 3, livroId: 3, status: "Lendo", nota: null, concluidaEm: null },
]

describe("estatísticas da biblioteca", () => {
  it("conta livros por categoria", () => {
    const resultado = contarPorCategoria(livros, [
      { id: 1, nome: "Romance", descricao: "" },
      { id: 2, nome: "Fantasia", descricao: "" },
    ])
    expect(resultado[0]).toEqual({ categoria: "Romance", livros: 2 })
  })

  it("agrupa livros por faixa de páginas", () => {
    const faixas = faixasDePaginas(livros)
    expect(faixas[0].livros).toBe(1)
    expect(faixas[3].livros).toBe(1)
    expect(faixas[5].livros).toBe(1)
  })

  it("preenche os meses sem leitura com zero", () => {
    expect(leiturasPorMes(leituras)).toEqual([
      { mes: "Jan/26", leituras: 1 },
      { mes: "Fev/26", leituras: 0 },
      { mes: "Mar/26", leituras: 1 },
    ])
  })

  it("calcula o resumo", () => {
    expect(calcularResumo(livros, leituras)).toEqual({ totalLivros: 3, livrosLidos: 2, paginasLidas: 440, notaMedia: 4 })
  })
})
