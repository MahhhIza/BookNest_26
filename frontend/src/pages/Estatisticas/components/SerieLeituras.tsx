import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { LeiturasPorMes } from "@/types/estatisticas"

export default function SerieLeituras({ dados }: { dados: LeiturasPorMes[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip />
        <Line type="monotone" dataKey="leituras" name="Leituras" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
