import { Link } from "react-router-dom"
import type { Livro } from "@/types/livro"
import { corDaCategoria } from "@/utils/capas"

const FAIXAS_DOURADAS = "linear-gradient(to bottom, transparent 14px, #b8975a 14px, #b8975a 16px, transparent 16px, transparent calc(100% - 16px), #b8975a calc(100% - 16px), #b8975a calc(100% - 14px), transparent calc(100% - 14px))"

type Props = { livros: Livro[]; lidos: Set<number>; editavel: boolean }

export default function Estante({ livros, lidos, editavel }: Props) {
  const maiorLivro = Math.max(1, ...livros.map((l) => l.paginas))

  return (
    <div>
      <div className="estante-prateleira">
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
              className="lombada"
            >
              <span>{livro.titulo}</span>
            </Link>
          )
        })}
      </div>
      <div className="estante-base" />
    </div>
  )
}
