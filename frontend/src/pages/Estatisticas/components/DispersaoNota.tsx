import type { PaginasPorNota } from "@/types/estatisticas"
import { regressaoLinear } from "@/utils/estatisticas"

const NOTAS = [1, 2, 3, 4, 5]

export default function DispersaoNota({ dados }: { dados: PaginasPorNota[] }) {
  const maxPaginas = Math.max(100, Math.ceil(Math.max(0, ...dados.map((d) => d.paginas)) / 100) * 100)
  const reta = regressaoLinear(dados)
  const limitar = (nota: number) => Math.min(5, Math.max(0, nota))
  const notaInicial = reta ? limitar(reta.intercepto) : 0
  const notaFinal = reta ? limitar(reta.intercepto + reta.inclinacao * maxPaginas) : 0
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
        {reta && (
          <svg className="dispersao-reta" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1={100 - (notaInicial / 5) * 100} x2="100" y2={100 - (notaFinal / 5) * 100} vectorEffect="non-scaling-stroke" />
          </svg>
        )}
        {dados.map((d, i) => (
          <span key={i} className="ponto" title={`${d.paginas} páginas, nota ${d.nota}`} style={{ left: `${(d.paginas / maxPaginas) * 100}%`, bottom: `${(d.nota / 5) * 100}%` }} />
        ))}
      </div>
      <div className="dispersao-eixo">
        <span>0</span>
        <span>{maxPaginas / 2} páginas</span>
        <span>{maxPaginas}</span>
      </div>
      {reta && <p className="dispersao-legenda">Linha tracejada: regressão linear (tendência entre páginas e nota)</p>}
    </div>
  )
}
