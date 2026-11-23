import CrudList from "@/components/CrudList"
import { useAllRecords } from "@/hooks/useAllRecords"
import { usePageTitle } from "@/hooks/usePageTitle"
import { leituraService } from "@/services/leituraService"
import { livroService } from "@/services/livroService"
import { formatarData } from "@/utils/format"

export default function Leituras() {
  usePageTitle("Leituras")
  const { byId: livros } = useAllRecords(livroService)

  return (
    <CrudList
      title="Leituras"
      description="O que você já leu, está lendo ou quer ler."
      entityName="leitura"
      basePath="/leituras"
      newPath="/leituras/nova"
      newLabel="Nova leitura"
      allowUserManagement
      emptyMessage="Você ainda não registrou nenhuma leitura."
      service={leituraService}
      itemLabel={(l) => l.livroTitulo ?? livros.get(l.livroId ?? 0)?.titulo ?? "leitura"}
      columns={[
        {
          header: "Livro",
          cell: (l) => (
            <span className="destaque">
              {l.livroTitulo ?? livros.get(l.livroId ?? 0)?.titulo ?? "—"}
            </span>
          ),
        },
        { header: "Status", cell: (l) => l.status },
        {
          header: "Nota",
          cell: (l) => (l.nota === null ? "—" : `${l.nota} de 5`),
          hideOnMobile: true,
        },
        {
          header: "Terminou em",
          cell: (l) => <span className="texto-mudo">{formatarData(l.concluidaEm)}</span>,
          hideOnMobile: true,
        },
      ]}
    />
  )
}