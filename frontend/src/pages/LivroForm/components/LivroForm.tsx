import { useState, type ChangeEvent, type FormEvent } from "react"
import FormActions from "@/components/FormActions"
import FormField from "@/components/FormField"
import SelectField from "@/components/SelectField"
import { useAllRecords } from "@/hooks/useAllRecords"
import { autorService } from "@/services/autorService"
import { categoriaService } from "@/services/categoriaService"
import type { CrudFormProps } from "@/types/form"
import type { LivroInput } from "@/types/livro"
import { isHttpUrl } from "@/utils/validators"

type Values = { titulo: string; autorId: string; categoriaId: string; paginas: string; ano: string; capaUrl: string }
type Errors = Partial<Record<keyof LivroInput, string>>

const toValues = (l?: LivroInput): Values => ({
  titulo: l?.titulo ?? "",
  autorId: l ? String(l.autorId) : "",
  categoriaId: l ? String(l.categoriaId) : "",
  paginas: l ? String(l.paginas) : "",
  ano: l ? String(l.ano) : "",
  capaUrl: l?.capaUrl ?? "",
})

function validate(v: Values): Errors {
  const e: Errors = {}
  const paginas = Number(v.paginas)
  const ano = Number(v.ano)
  if (v.titulo.trim().length < 2) e.titulo = "Informe o título do livro."
  if (!v.autorId) e.autorId = "Escolha o autor."
  if (!v.categoriaId) e.categoriaId = "Escolha a categoria."
  if (!Number.isInteger(paginas) || paginas < 1) e.paginas = "Informe o número de páginas."
  if (!Number.isInteger(ano) || ano < 1000 || ano > new Date().getFullYear()) e.ano = "Informe um ano válido."
  const capa = v.capaUrl.trim()
  if (capa && (capa.length > 500 || !isHttpUrl(capa))) e.capaUrl = "Informe um link válido, começando com http:// ou https://."
  return e
}

export default function LivroForm({ initial, saving, fieldErrors = {}, submitLabel, onSubmit }: CrudFormProps<LivroInput>) {
  const [values, setValues] = useState<Values>(toValues(initial))
  const [errors, setErrors] = useState<Errors>({})
  const { records: autores } = useAllRecords(autorService)
  const { records: categorias } = useAllRecords(categoriaService)

  const set = (field: keyof Values) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [field]: ev.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit({ titulo: values.titulo.trim(), autorId: Number(values.autorId), categoriaId: Number(values.categoriaId), paginas: Number(values.paginas), ano: Number(values.ano), capaUrl: values.capaUrl.trim() || null })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Título" name="titulo" value={values.titulo} onChange={set("titulo")} error={errors.titulo ?? fieldErrors.titulo} />
      <SelectField label="Autor" name="autorId" placeholder="Escolha o autor" value={values.autorId} onChange={set("autorId")} options={autores.map((a) => ({ value: a.id, label: a.nome }))} error={errors.autorId ?? fieldErrors.autorId} />
      <SelectField label="Categoria" name="categoriaId" placeholder="Escolha a categoria" value={values.categoriaId} onChange={set("categoriaId")} options={categorias.map((c) => ({ value: c.id, label: c.nome }))} error={errors.categoriaId ?? fieldErrors.categoriaId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Páginas" name="paginas" type="number" min={1} value={values.paginas} onChange={set("paginas")} error={errors.paginas ?? fieldErrors.paginas} />
        <FormField label="Ano de publicação" name="ano" type="number" value={values.ano} onChange={set("ano")} error={errors.ano ?? fieldErrors.ano} />
      </div>
      <FormField label="Link da capa (opcional)" name="capaUrl" type="url" placeholder="https://" value={values.capaUrl} onChange={set("capaUrl")} error={errors.capaUrl ?? fieldErrors.capaUrl} hint="Se ficar vazio, o BookNest desenha uma capa pelo título." />
      <FormActions cancelTo="/livros" saving={saving} submitLabel={submitLabel} />
    </form>
  )
}
