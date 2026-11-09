import { Link } from "react-router-dom"
import type { Livro } from "@/types/livro"
import { corDaCategoria } from "@/utils/capas"

const FAIXAS_DOURADAS = "linear-gradient(to bottom, transparent 14px, #b8975a 14px, #b8975a 16px, transparent 16px, transparent calc(100% - 16px), #b8975a calc(100% - 16px), #b8975a calc(100% - 14px), transparent calc(100% - 14px))"

type Props = { livros: Livro[]; lidos: Set<number>; editavel: boolean }

export default function Estante({ livros, lidos, editavel }: Props) {
  const maiorLivro = Math.max(1, ...livros.map((l) => l.paginas))

  return (
    <div>
      <div className="flex min-h-48 items-end gap-1 overflow-x-auto px-6 pt-4">
        {livros.map((livro) => {
          const altura = 120 + (livro.paginas / maiorLivro) * 90
          const largura = 30 + (livro.paginas / maiorLivro) * 18
          const lido = lidos.has(livro.id)
          const cor = corDaCategoria(livro.categoriaId)
          return (
            <Link
              key={livro.id}
              to={editavel ? `/livros/${livro.id}/editar` : "/livros"}
              title={`${livro.titulo} · ${livro.paginas} páginas${lido ? " · lido" : ""}`}
              aria-label={`${livro.titulo}, ${livro.paginas} páginas${lido ? ", já lido" : ""}`}
              style={{ height: altura, width: largura, backgroundColor: cor.fundo, backgroundImage: FAIXAS_DOURADAS, color: cor.texto, opacity: lido ? 1 : 0.45 }}
              className="flex shrink-0 items-center justify-center overflow-hidden rounded-t-sm px-1 py-6 shadow-sm transition-transform duration-200 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="max-h-full rotate-180 truncate text-xs font-medium [writing-mode:vertical-rl]">{livro.titulo}</span>
            </Link>
          )
        })}
      </div>
      <div className="h-3 rounded-sm bg-[#3b2a1e] shadow-[0_6px_10px_-4px_rgb(28_42_31/0.35)]" />
    </div>
  )
}
