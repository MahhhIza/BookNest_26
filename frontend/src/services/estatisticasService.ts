import { categoriaService } from "@/services/categoriaService"
import { leituraService } from "@/services/leituraService"
import { livroService } from "@/services/livroService"
import { minhaEstanteService } from "@/services/minhaEstanteService"
import type { Estatisticas } from "@/types/estatisticas"
import {
  calcularResumo,
  contarPorCategoria,
  faixasDePaginas,
  leiturasPorMes,
  paginasPorNota,
} from "@/utils/estatisticas"

export async function getEstatisticas(): Promise<Estatisticas> {
  const [livros, categorias, leituras, livrosPessoais] = await Promise.all([
    livroService.all(),
    categoriaService.all(),
    leituraService.all(),
    minhaEstanteService.listar(),
  ])

  return {
    resumo: calcularResumo(livros, leituras, livrosPessoais),
    livrosPorCategoria: contarPorCategoria(livros, categorias),
    faixasDePaginas: faixasDePaginas(livros, livrosPessoais),
    leiturasPorMes: leiturasPorMes(leituras),
    paginasPorNota: paginasPorNota(livros, leituras, livrosPessoais),
  }
}
