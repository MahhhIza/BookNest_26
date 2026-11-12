import type { FaixaDePaginas } from "@/types/estatisticas"
import Colunas from "./Colunas"

export default function HistogramaPaginas({ dados }: { dados: FaixaDePaginas[] }) {
  return <Colunas dados={dados.map((d) => ({ rotulo: d.faixa, valor: d.livros }))} />
}
