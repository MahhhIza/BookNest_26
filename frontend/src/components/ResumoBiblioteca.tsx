import type { Resumo } from "@/types/estatisticas"

export default function ResumoBiblioteca({ resumo }: { resumo: Resumo }) {
  const itens = [
    { rotulo: "Livros na estante", valor: resumo.totalLivros.toLocaleString("pt-BR") },
    { rotulo: "Livros lidos", valor: resumo.livrosLidos.toLocaleString("pt-BR") },
    { rotulo: "Páginas lidas", valor: resumo.paginasLidas.toLocaleString("pt-BR") },
    { rotulo: "Nota média", valor: resumo.notaMedia === null ? "—" : resumo.notaMedia.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) },
  ]
  return (
    <dl className="resumo">
      {itens.map((item) => (
        <div key={item.rotulo} className="resumo-item">
          <dd>{item.valor}</dd>
          <dt>{item.rotulo}</dt>
        </div>
      ))}
    </dl>
  )
}
