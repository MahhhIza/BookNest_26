import CrudList from "@/components/CrudList"
import { useAllRecords } from "@/hooks/useAllRecords"
import { usePageTitle } from "@/hooks/usePageTitle"
import { autorService } from "@/services/autorService"
import { categoriaService } from "@/services/categoriaService"
import { livroService } from "@/services/livroService"
import { useAuth } from "@/hooks/useAuth"
import GaleriaLivros from "./components/GaleriaLivros"

export default function Livros() {
  usePageTitle("Livros")
  const { isAdmin } = useAuth()
  const { byId: autores } = useAllRecords(autorService)
  const { byId: categorias } = useAllRecords(categoriaService)

  return (
    <CrudList
      title="Livros"
      description="Tudo o que está na sua estante."
      entityName="livro"
      basePath="/livros"
      newPath="/livros/novo"
      newLabel="Novo livro"
      emptyMessage="Sua estante ainda está vazia."
      service={livroService}
      itemLabel={(l) => l.titulo}
      galeria={(rows) => <GaleriaLivros livros={rows} autores={autores} editavel={isAdmin} />}
      columns={[
        { header: "Título", cell: (l) => <span className="destaque">{l.titulo}</span> },
        { header: "Autor", cell: (l) => autores.get(l.autorId)?.nome ?? "—" },
        { header: "Categoria", cell: (l) => <span className="texto-mudo">{categorias.get(l.categoriaId)?.nome ?? "—"}</span>, hideOnMobile: true },
        { header: "Páginas", cell: (l) => l.paginas, className: "col-direita", hideOnMobile: true },
        { header: "Ano", cell: (l) => l.ano, className: "col-direita", hideOnMobile: true },
      ]}
    />
  )
}
