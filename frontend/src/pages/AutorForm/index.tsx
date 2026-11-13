import CrudFormPage from "@/components/CrudFormPage"
import { autorService } from "@/services/autorService"
import type { Autor, AutorInput } from "@/types/autor"
import AutorForm from "./components/AutorForm"

const toInput = (a: Autor): AutorInput => ({ nome: a.nome, nacionalidade: a.nacionalidade })

export default function AutorFormPage() {
  return (
    <CrudFormPage service={autorService} listPath="/autores" entityName="autor" toInput={toInput}>
      {(props) => <AutorForm {...props} />}
    </CrudFormPage>
  )
}
