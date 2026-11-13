import { Link } from "react-router-dom"
import CapaLivro from "@/components/CapaLivro"
import type { Autor } from "@/types/autor"
import type { Livro } from "@/types/livro"

type Props = { livros: Livro[]; autores: Map<number, Autor>; editavel: boolean }

export default function GaleriaLivros({ livros, autores, editavel }: Props) {
  return (
    <ul className="galeria">
      {livros.map((livro) => {
        const capa = <CapaLivro titulo={livro.titulo} autor={autores.get(livro.autorId)?.nome} categoriaId={livro.categoriaId} capaUrl={livro.capaUrl} />
        return (
          <li key={livro.id}>
            {editavel ? (
              <Link to={`/livros/${livro.id}/editar`} aria-label={`Editar ${livro.titulo}`} className="capa-link">
                {capa}
              </Link>
            ) : (
              capa
            )}
            <p className="galeria-info">
              {livro.paginas} páginas · {livro.ano}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
