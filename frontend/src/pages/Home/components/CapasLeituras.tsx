import { Link } from "react-router-dom"
import CapaLivro from "@/components/CapaLivro"
import type { Livro } from "@/types/livro"

type Item = { id: number; livro: Livro; autor: string }
type Props = { titulo: string; vazio: string; editavel: boolean; itens: Item[] }

export default function CapasLeituras({ titulo, vazio, editavel, itens }: Props) {
  return (
    <section className="secao">
      <h2>{titulo}</h2>
      {itens.length === 0 ? (
        <p className="aviso">{vazio}</p>
      ) : (
        <ul className="capas-lista">
          {itens.map((item) => (
            <li key={item.id}>
              <Link to={editavel ? `/leituras/${item.id}/editar` : "/leituras"} aria-label={item.livro.titulo} className="capa-link">
                <CapaLivro titulo={item.livro.titulo} autor={item.autor} categoriaId={item.livro.categoriaId} capaUrl={item.livro.capaUrl} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
