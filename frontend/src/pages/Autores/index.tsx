import CrudList from "@/components/CrudList"
import { usePageTitle } from "@/hooks/usePageTitle"
import { autorService } from "@/services/autorService"

export default function Autores() {
  usePageTitle("Autores")
  return (
    <CrudList
      title="Autores"
      description="As pessoas por trás dos livros da sua estante."
      entityName="autor"
      basePath="/autores"
      newPath="/autores/novo"
      newLabel="Novo autor"
      emptyMessage="Você ainda não cadastrou nenhum autor."
      service={autorService}
      itemLabel={(a) => a.nome}
      columns={[
        { header: "Nome", cell: (a) => <span className="font-medium">{a.nome}</span> },
        { header: "Nacionalidade", cell: (a) => <span className="text-muted-foreground">{a.nacionalidade || "—"}</span>, hideOnMobile: true },
      ]}
    />
  )
}
