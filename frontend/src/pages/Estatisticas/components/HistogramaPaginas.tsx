import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { FaixaDePaginas } from "@/types/estatisticas"

export default function HistogramaPaginas({ dados }: { dados: FaixaDePaginas[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dados} barCategoryGap={2}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="faixa" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip cursor={{ fill: "var(--secondary)" }} />
        <Bar dataKey="livros" name="Livros" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
