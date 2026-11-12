import type { ReactNode } from "react"

type Props = { title: string; description: string; children: ReactNode }

export default function ChartCard({ title, description, children }: Props) {
  return (
    <section className="cartao">
      <div className="cartao-cabecalho">
        <h2 className="grafico-titulo">{title}</h2>
        <p className="cartao-descricao">{description}</p>
      </div>
      <div className="grafico-corpo">{children}</div>
    </section>
  )
}
