import CrudFormPage from "@/components/CrudFormPage"
import { livroService } from "@/services/livroService"
import type { Livro, LivroInput } from "@/types/livro"
import LivroForm from "./components/LivroForm"

const toInput = (l: Livro): LivroInput => ({ titulo: l.titulo, autorId: l.autorId, categoriaId: l.categoriaId, paginas: l.paginas, ano: l.ano, capaUrl: l.capaUrl ?? null })

export default function LivroFormPage() {
  return (
    <CrudFormPage service={livroService} listPath="/livros" entityName="livro" toInput={toInput}>
      {(props) => <LivroForm {...props} />}
    </CrudFormPage>
  )
}
