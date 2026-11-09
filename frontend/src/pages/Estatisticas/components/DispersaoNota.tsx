import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts"
import type { PaginasPorNota } from "@/types/estatisticas"

export default function DispersaoNota({ dados }: { dados: PaginasPorNota[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="paginas" name="Páginas" tickLine={false} fontSize={12} />
        <YAxis type="number" dataKey="nota" name="Nota" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} fontSize={12} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={dados} fill="var(--primary)" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
