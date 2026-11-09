import CrudList from "@/components/CrudList"
import { usePageTitle } from "@/hooks/usePageTitle"
import { categoriaService } from "@/services/categoriaService"

export default function Categorias() {
  usePageTitle("Categorias")
  return (
    <CrudList
      title="Categorias"
      description="Organize seus livros por gênero."
      entityName="categoria"
      basePath="/categorias"
      newPath="/categorias/nova"
      newLabel="Nova categoria"
      emptyMessage="Você ainda não cadastrou nenhuma categoria."
      service={categoriaService}
      itemLabel={(c) => c.nome}
      columns={[
        { header: "Nome", cell: (c) => <span className="font-medium">{c.nome}</span> },
        { header: "Descrição", cell: (c) => <span className="text-muted-foreground">{c.descricao || "—"}</span>, hideOnMobile: true },
      ]}
    />
  )
}
