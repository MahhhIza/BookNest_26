import type { LivrosPorCategoria } from "@/types/estatisticas"

export default function BarrasCategorias({ dados }: { dados: LivrosPorCategoria[] }) {
  const maior = Math.max(1, ...dados.map((d) => d.livros))
  return (
    <ul className="barras">
      {dados.map((d) => (
        <li key={d.categoria} className="barras-linha">
          <span title={d.categoria}>{d.categoria}</span>
          <div className="barras-trilho">
            <div className="barras-preenchimento" style={{ width: `${(d.livros / maior) * 100}%` }} />
          </div>
          <span>{d.livros}</span>
        </li>
      ))}
    </ul>
  )
}
