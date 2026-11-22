
import { Link } from "react-router-dom"
import type { Livro } from "@/types/livro"
import type { LivroMinhaEstante } from "@/services/minhaEstanteService"
import { corDaCategoria } from "@/utils/capas"

const FAIXAS_DOURADAS =
  "linear-gradient(to bottom, transparent 14px, #b8975a 14px, #b8975a 16px, transparent 16px, transparent calc(100% - 16px), #b8975a calc(100% - 16px), #b8975a calc(100% - 14px), transparent calc(100% - 14px))"

const CORES_PESSOAIS = [
  { fundo: "#526477", texto: "#ffffff" },
  { fundo: "#92776e", texto: "#ffffff" },
  { fundo: "#476b50", texto: "#ffffff" },
  { fundo: "#9a695e", texto: "#ffffff" },
  { fundo: "#74658a", texto: "#ffffff" },
  { fundo: "#a17c45", texto: "#ffffff" },
]

type Props = {
  livros: Livro[]
  livrosPessoais: LivroMinhaEstante[]
  lidos: Set<number>
  editavel: boolean
}

export default function Estante({
  livros,
  livrosPessoais,
  lidos,
  editavel,
}: Props) {
  const todosLivros = [
    ...livros.map((livro) => ({
      chave: `catalogo-${livro.id}`,
      titulo: livro.titulo,
      paginas: livro.paginas || 1,
      lido: lidos.has(livro.id),
      cor: corDaCategoria(livro.categoriaId),
      destino: editavel ? `/livros/${livro.id}/editar` : "/livros",
    })),
    ...livrosPessoais.map((livro, indice) => ({
      chave: `pessoal-${livro.id}`,
      titulo: livro.titulo,
      paginas: livro.paginas || 1,
      lido: false,
      cor: CORES_PESSOAIS[indice % CORES_PESSOAIS.length],
      destino: null,
    })),
  ]

  const maiorLivro = Math.max(
    1,
    ...todosLivros.map((livro) => livro.paginas),
  )

  return (
    <div>
      <div className="estante-prateleira">
        {todosLivros.map((livro) => {
          const altura = 120 + (livro.paginas / maiorLivro) * 90
          const largura = 30 + (livro.paginas / maiorLivro) * 18

          const estilo = {
            height: altura,
            width: largura,
            backgroundColor: livro.cor.fundo,
            backgroundImage: FAIXAS_DOURADAS,
            color: livro.cor.texto,
            opacity: livro.lido ? 1 : 0.45,
          }

          const conteudo = <span>{livro.titulo}</span>

          return livro.destino ? (
            <Link
              key={livro.chave}
              to={livro.destino}
              title={livro.titulo}
              aria-label={livro.titulo}
              style={estilo}
              className="lombada"
            >
              {conteudo}
            </Link>
          ) : (
            <div
              key={livro.chave}
              title={`${livro.titulo} · Estante pessoal`}
              aria-label={`${livro.titulo}, livro da sua estante pessoal`}
              style={estilo}
              className="lombada"
            >
              {conteudo}
            </div>
          )
        })}
      </div>

      <div className="estante-base" />
    </div>
  )
}
