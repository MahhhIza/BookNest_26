import type { Resumo } from "@/types/estatisticas"

export default function ResumoBiblioteca({ resumo }: { resumo: Resumo }) {
  const itens = [
    { rotulo: "Livros na estante", valor: resumo.totalLivros.toLocaleString("pt-BR") },
    { rotulo: "Livros lidos", valor: resumo.livrosLidos.toLocaleString("pt-BR") },
    { rotulo: "Páginas lidas", valor: resumo.paginasLidas.toLocaleString("pt-BR") },
    { rotulo: "Nota média", valor: resumo.notaMedia === null ? "—" : resumo.notaMedia.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) },
  ]
  return (
    <dl className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
      {itens.map((item) => (
        <div key={item.rotulo} className="border-l-2 border-gold/60 pl-4">
          <dd className="text-2xl font-semibold tracking-tight">{item.valor}</dd>
          <dt className="text-sm text-muted-foreground">{item.rotulo}</dt>
        </div>
      ))}
    </dl>
  )
}
