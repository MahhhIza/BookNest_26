import { useState, type ChangeEvent, type FormEvent } from "react"
import FormActions from "@/components/FormActions"
import FormField from "@/components/FormField"
import type { AutorInput } from "@/types/autor"
import type { CrudFormProps } from "@/types/form"

type Errors = Partial<Record<keyof AutorInput, string>>

function validate(v: AutorInput): Errors {
  const e: Errors = {}
  if (v.nome.trim().length < 2) e.nome = "Informe o nome do autor."
  if (v.nacionalidade.length > 60) e.nacionalidade = "Use no máximo 60 caracteres."
  return e
}

export default function AutorForm({ initial = { nome: "", nacionalidade: "" }, saving, fieldErrors = {}, submitLabel, onSubmit }: CrudFormProps<AutorInput>) {
  const [values, setValues] = useState<AutorInput>(initial)
  const [errors, setErrors] = useState<Errors>({})

  const set = (field: keyof AutorInput) => (ev: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: ev.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit({ nome: values.nome.trim(), nacionalidade: values.nacionalidade.trim() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Nome" name="nome" value={values.nome} onChange={set("nome")} error={errors.nome ?? fieldErrors.nome} />
      <FormField label="Nacionalidade (opcional)" name="nacionalidade" value={values.nacionalidade} onChange={set("nacionalidade")} error={errors.nacionalidade ?? fieldErrors.nacionalidade} />
      <FormActions cancelTo="/autores" saving={saving} submitLabel={submitLabel} />
    </form>
  )
}
