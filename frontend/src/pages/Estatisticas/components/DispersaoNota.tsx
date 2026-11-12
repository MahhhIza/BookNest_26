import type { PaginasPorNota } from "@/types/estatisticas"

const NOTAS = [1, 2, 3, 4, 5]

export default function DispersaoNota({ dados }: { dados: PaginasPorNota[] }) {
  const maxPaginas = Math.max(100, Math.ceil(Math.max(0, ...dados.map((d) => d.paginas)) / 100) * 100)
  return (
    <div className="dispersao">
      <div className="dispersao-area">
        {NOTAS.map((nota) => (
          <div key={nota}>
            <div className="dispersao-linha" style={{ bottom: `${(nota / 5) * 100}%` }} />
            <span className="dispersao-nota" style={{ bottom: `${(nota / 5) * 100}%` }}>
              {nota}
            </span>
          </div>
        ))}
        {dados.map((d, i) => (
          <span key={i} className="ponto" title={`${d.paginas} páginas, nota ${d.nota}`} style={{ left: `${(d.paginas / maxPaginas) * 100}%`, bottom: `${(d.nota / 5) * 100}%` }} />
        ))}
      </div>
      <div className="dispersao-eixo">
        <span>0</span>
        <span>{maxPaginas / 2} páginas</span>
        <span>{maxPaginas}</span>
      </div>
    </div>
  )
}
