type Coluna = { rotulo: string; valor: number }

export default function Colunas({ dados }: { dados: Coluna[] }) {
  const maior = Math.max(1, ...dados.map((d) => d.valor))
  return (
    <div className="colunas">
      {dados.map((d) => (
        <div key={d.rotulo} className="coluna">
          <div className="coluna-area">
            <div className="coluna-barra" style={{ height: `${(d.valor / maior) * 100}%` }}>
              <span className="coluna-valor">{d.valor}</span>
            </div>
          </div>
          <span className="coluna-rotulo" title={d.rotulo}>
            {d.rotulo}
          </span>
        </div>
      ))}
    </div>
  )
}
