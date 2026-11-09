import { Link } from "react-router-dom"
import CapaLivro from "@/components/CapaLivro"
import type { Livro } from "@/types/livro"

type Item = { id: number; livro: Livro; autor: string }
type Props = { titulo: string; vazio: string; editavel: boolean; itens: Item[] }

export default function CapasLeituras({ titulo, vazio, editavel, itens }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="text-sm text-muted-foreground">{vazio}</p>
      ) : (
        <ul className="flex flex-wrap gap-4">
          {itens.map((item) => (
            <li key={item.id} className="w-32">
              <Link to={editavel ? `/leituras/${item.id}/editar` : "/leituras"} aria-label={item.livro.titulo} className="block transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1">
                <CapaLivro titulo={item.livro.titulo} autor={item.autor} categoriaId={item.livro.categoriaId} capaUrl={item.livro.capaUrl} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
