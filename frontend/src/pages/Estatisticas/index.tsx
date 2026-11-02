import { useEffect, useState } from "react"
import PageHeader from "@/components/PageHeader"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getEstatisticas } from "@/services/estatisticasService"
import type { Estatisticas as Dados } from "@/types/estatisticas"
import BarrasCategorias from "./components/BarrasCategorias"
import ChartCard from "./components/ChartCard"
import DispersaoPaginas from "./components/DispersaoPaginas"
import SerieLeituras from "./components/SerieLeituras"

export default function Estatisticas() {
  usePageTitle("Estatísticas")
  const [dados, setDados] = useState<Dados | null>(null)

  useEffect(() => {
    getEstatisticas().then(setDados)
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader title="Estatísticas" description="Dados de exemplo da sua biblioteca. Vão vir do banco quando as rotas estiverem prontas." />
      {dados && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Livros por categoria" description="Quantos livros existem em cada categoria">
            <BarrasCategorias dados={dados.livrosPorCategoria} />
          </ChartCard>
          <ChartCard title="Leituras por mês" description="Evolução das leituras concluídas ao longo do tempo">
            <SerieLeituras dados={dados.leiturasPorMes} />
          </ChartCard>
          <ChartCard title="Páginas e tempo de leitura" description="Relação entre o número de páginas e os dias para terminar o livro">
            <DispersaoPaginas dados={dados.paginasPorDias} />
          </ChartCard>
        </div>
      )}
    </div>
  )
}
