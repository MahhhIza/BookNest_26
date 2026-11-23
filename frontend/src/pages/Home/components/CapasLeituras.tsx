import { Link } from "react-router-dom"
import CapaLivro from "@/components/CapaLivro"

type LivroExibicao = {
  titulo: string
  categoriaId?: number
  capaUrl?: string | null
}

type Item = {
  id: number
  livro: LivroExibicao
  autor: string
}

type Props = {
  titulo: string
  vazio: string
  editavel: boolean
  itens: Item[]
}

export default function CapasLeituras({
  titulo,
  vazio,
  editavel,
  itens,
}: Props) {
  return (
    <section className="secao">
      <h2>{titulo}</h2>

      {itens.length === 0 ? (
        <p className="aviso">{vazio}</p>
      ) : (
        <ul className="capas-lista">
          {itens.map((item) => (
            <li key={item.id}>
              <Link
                to={editavel ? `/leituras/${item.id}/editar` : "/leituras"}
                aria-label={item.livro.titulo}
                className="capa-link"
              >
                <CapaLivro
                  titulo={item.livro.titulo}
                  autor={item.autor}
                  categoriaId={item.livro.categoriaId ?? 0}
                  capaUrl={item.livro.capaUrl}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
