import { useState, type ChangeEvent, type FormEvent } from "react"
import FormActions from "@/components/FormActions"
import FormField from "@/components/FormField"
import type { CategoriaInput } from "@/types/categoria"
import type { CrudFormProps } from "@/types/form"

type Errors = Partial<Record<keyof CategoriaInput, string>>

function validate(v: CategoriaInput): Errors {
  const e: Errors = {}
  if (v.nome.trim().length < 2) e.nome = "Informe o nome da categoria."
  if (v.descricao.length > 255) e.descricao = "A descrição deve ter no máximo 255 caracteres."
  return e
}

export default function CategoriaForm({ initial = { nome: "", descricao: "" }, saving, fieldErrors = {}, submitLabel, onSubmit }: CrudFormProps<CategoriaInput>) {
  const [values, setValues] = useState<CategoriaInput>(initial)
  const [errors, setErrors] = useState<Errors>({})

  const set = (field: keyof CategoriaInput) => (ev: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: ev.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit({ nome: values.nome.trim(), descricao: values.descricao.trim() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Nome" name="nome" value={values.nome} onChange={set("nome")} error={errors.nome ?? fieldErrors.nome} />
      <FormField label="Descrição (opcional)" name="descricao" value={values.descricao} onChange={set("descricao")} error={errors.descricao ?? fieldErrors.descricao} />
      <FormActions cancelTo="/categorias" saving={saving} submitLabel={submitLabel} />
    </form>
  )
}
