import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { LivrosPorCategoria } from "@/types/estatisticas"

export default function BarrasCategorias({ dados }: { dados: LivrosPorCategoria[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dados} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <YAxis type="category" dataKey="categoria" width={96} tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip cursor={{ fill: "var(--secondary)" }} />
        <Bar dataKey="livros" name="Livros" fill="var(--primary)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
