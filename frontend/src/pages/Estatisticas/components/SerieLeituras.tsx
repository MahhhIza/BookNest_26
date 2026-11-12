import type { LeiturasPorMes } from "@/types/estatisticas"
import Colunas from "./Colunas"

export default function SerieLeituras({ dados }: { dados: LeiturasPorMes[] }) {
  return <Colunas dados={dados.map((d) => ({ rotulo: d.mes, valor: d.leituras }))} />
}
