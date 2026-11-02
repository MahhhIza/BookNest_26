import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts"
import type { PaginasPorDias } from "@/types/estatisticas"

export default function DispersaoPaginas({ dados }: { dados: PaginasPorDias[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="dias" name="Dias" unit=" d" tickLine={false} fontSize={12} />
        <YAxis type="number" dataKey="paginas" name="Páginas" tickLine={false} fontSize={12} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={dados} fill="var(--primary)" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
