import CrudFormPage from "@/components/CrudFormPage"
import { categoriaService } from "@/services/categoriaService"
import type { Categoria, CategoriaInput } from "@/types/categoria"
import CategoriaForm from "./components/CategoriaForm"

const toInput = (c: Categoria): CategoriaInput => ({ nome: c.nome, descricao: c.descricao })

export default function CategoriaFormPage() {
  return (
    <CrudFormPage service={categoriaService} listPath="/categorias" entityName="categoria" feminino toInput={toInput}>
      {(props) => <CategoriaForm {...props} />}
    </CrudFormPage>
  )
}
