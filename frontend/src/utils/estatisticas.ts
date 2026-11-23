import type { Categoria } from "@/types/categoria"
import type { FaixaDePaginas, LeiturasPorMes, LivrosPorCategoria, PaginasPorNota, Resumo } from "@/types/estatisticas"
import type { Leitura } from "@/types/leitura"
import type { Livro } from "@/types/livro"
import type { LivroMinhaEstante } from "@/services/minhaEstanteService"

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
const LIMITES_PAGINAS = [100, 200, 300, 400, 500]

export function contarPorCategoria(livros: Livro[], categorias: Categoria[]): LivrosPorCategoria[] {
  const nomes = new Map(categorias.map((c) => [c.id, c.nome]))
  const contagem = new Map<number, number>()
  for (const livro of livros) contagem.set(livro.categoriaId, (contagem.get(livro.categoriaId) ?? 0) + 1)
  return [...contagem]
    .map(([id, total]) => ({ categoria: nomes.get(id) ?? "Sem categoria", livros: total }))
    .sort((a, b) => b.livros - a.livros)
    .slice(0, 8)
}

export function faixasDePaginas(
  livros: Livro[],
  livrosPessoais: LivroMinhaEstante[] = [],
): FaixaDePaginas[] {
  const rotulos = ["Até 100", "101–200", "201–300", "301–400", "401–500", "Mais de 500"]
  const contagem = rotulos.map(() => 0)
  const quantidades = [
    ...livros.map((livro) => livro.paginas),
    ...livrosPessoais
      .map((livro) => livro.paginas)
      .filter((paginas): paginas is number => paginas !== null),
  ]

  for (const paginas of quantidades) {
    const indice = LIMITES_PAGINAS.findIndex((limite) => paginas <= limite)
    contagem[indice === -1 ? rotulos.length - 1 : indice] += 1
  }

  return rotulos.map((faixa, i) => ({ faixa, livros: contagem[i] }))
}
export function leiturasPorMes(leituras: Leitura[]): LeiturasPorMes[] {
  const concluidas = leituras.filter((l) => l.status === "Lido" && l.concluidaEm)
  if (concluidas.length === 0) return []
  const indices = concluidas.map((l) => {
    const [ano, mes] = (l.concluidaEm as string).split("-").map(Number)
    return ano * 12 + (mes - 1)
  })
  const primeiro = Math.min(...indices)
  const ultimo = Math.max(...indices)
  const serie: LeiturasPorMes[] = []
  for (let i = primeiro; i <= ultimo; i++) {
    serie.push({ mes: `${MESES[i % 12]}/${String(Math.floor(i / 12)).slice(2)}`, leituras: indices.filter((x) => x === i).length })
  }
  return serie
}

export function paginasPorNota(
  livros: Livro[],
  leituras: Leitura[],
  livrosPessoais: LivroMinhaEstante[] = [],
): PaginasPorNota[] {
  const porId = new Map(livros.map((l) => [l.id, l]))
  const pessoaisPorId = new Map(livrosPessoais.map((l) => [l.openLibraryId, l]))
  const pontos: PaginasPorNota[] = []

  for (const leitura of leituras) {
    if (leitura.status !== "Lido" || leitura.nota === null) continue

    const paginas = leitura.livroId !== null
      ? porId.get(leitura.livroId)?.paginas
      : leitura.openLibraryId !== null
        ? pessoaisPorId.get(leitura.openLibraryId)?.paginas ?? leitura.livroPaginas
        : null

    if (paginas !== null && paginas !== undefined) {
      pontos.push({ paginas, nota: leitura.nota })
    }
  }

  return pontos
}

export function calcularResumo(
  livros: Livro[],
  leituras: Leitura[],
  livrosPessoais: LivroMinhaEstante[] = [],
): Resumo {
  const porId = new Map(livros.map((l) => [l.id, l]))
  const pessoaisPorId = new Map(livrosPessoais.map((l) => [l.openLibraryId, l]))
  const lidos = new Set(
    leituras
      .filter((l) => l.status === "Lido")
      .map((l) => l.livroId !== null
        ? `catalogo:${l.livroId}`
        : l.openLibraryId !== null
          ? `pessoal:${l.openLibraryId}`
          : null)
      .filter((id): id is string => id !== null)
  )

  const notas = leituras
    .filter((l) => l.status === "Lido")
    .map((l) => l.nota)
    .filter((n): n is number => n !== null)

  let paginasLidas = 0

  for (const leitura of leituras) {
    if (leitura.status !== "Lido") continue

    if (leitura.livroId !== null) {
      paginasLidas += porId.get(leitura.livroId)?.paginas ?? 0
    } else if (leitura.openLibraryId !== null) {
      paginasLidas += pessoaisPorId.get(leitura.openLibraryId)?.paginas
        ?? leitura.livroPaginas
        ?? 0
    }
  }

  return {
    totalLivros: livros.length + livrosPessoais.length,
    livrosLidos: lidos.size,
    paginasLidas,
    notaMedia: notas.length ? notas.reduce((soma, n) => soma + n, 0) / notas.length : null,
  }
}

export function regressaoLinear(pontos: PaginasPorNota[]): { inclinacao: number; intercepto: number } | null {
  const n = pontos.length
  if (n < 2) return null
  const mediaX = pontos.reduce((soma, p) => soma + p.paginas, 0) / n
  const mediaY = pontos.reduce((soma, p) => soma + p.nota, 0) / n
  let cima = 0
  let baixo = 0
  for (const p of pontos) {
    cima += (p.paginas - mediaX) * (p.nota - mediaY)
    baixo += (p.paginas - mediaX) ** 2
  }
  if (baixo === 0) return null
  const inclinacao = cima / baixo
  return { inclinacao, intercepto: mediaY - inclinacao * mediaX }
}
