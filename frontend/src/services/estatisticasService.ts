import { categoriaService } from "@/services/categoriaService"
import { leituraService } from "@/services/leituraService"
import { livroService } from "@/services/livroService"
import type { Estatisticas } from "@/types/estatisticas"
import { calcularResumo, contarPorCategoria, faixasDePaginas, leiturasPorMes, paginasPorNota } from "@/utils/estatisticas"

export async function getEstatisticas(): Promise<Estatisticas> {
  const [livros, categorias, leituras] = await Promise.all([livroService.all(), categoriaService.all(), leituraService.all()])
  return {
    resumo: calcularResumo(livros, leituras),
    livrosPorCategoria: contarPorCategoria(livros, categorias),
    faixasDePaginas: faixasDePaginas(livros),
    leiturasPorMes: leiturasPorMes(leituras),
    paginasPorNota: paginasPorNota(livros, leituras),
  }
}
