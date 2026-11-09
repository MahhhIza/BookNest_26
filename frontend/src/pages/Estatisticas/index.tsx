import { useEffect, useState } from "react"
import PageHeader from "@/components/PageHeader"
import ResumoBiblioteca from "@/components/ResumoBiblioteca"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getEstatisticas } from "@/services/estatisticasService"
import type { Estatisticas as Dados } from "@/types/estatisticas"
import BarrasCategorias from "./components/BarrasCategorias"
import ChartCard from "./components/ChartCard"
import DispersaoNota from "./components/DispersaoNota"
import HistogramaPaginas from "./components/HistogramaPaginas"
import SerieLeituras from "./components/SerieLeituras"

export default function Estatisticas() {
  usePageTitle("Estatísticas")
  const [dados, setDados] = useState<Dados | null>(null)

  useEffect(() => {
    getEstatisticas().then(setDados)
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader title="Estatísticas" description="Um retrato da sua biblioteca, calculado a partir dos livros e leituras cadastrados." />
      {dados && <ResumoBiblioteca resumo={dados.resumo} />}
      {dados && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Livros por categoria" description="Em quais gêneros a sua estante está concentrada">
            <BarrasCategorias dados={dados.livrosPorCategoria} />
          </ChartCard>
          <ChartCard title="Tamanho dos livros" description="Quantos livros existem em cada faixa de páginas">
            <HistogramaPaginas dados={dados.faixasDePaginas} />
          </ChartCard>
          <ChartCard title="Leituras por mês" description="Livros concluídos ao longo do tempo">
            <SerieLeituras dados={dados.leiturasPorMes} />
          </ChartCard>
          <ChartCard title="Páginas e nota" description="Os livros mais longos ganham notas melhores?">
            <DispersaoNota dados={dados.paginasPorNota} />
          </ChartCard>
        </div>
      )}
    </div>
  )
}
