import { Loader2 } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router-dom"
import FormField from "@/components/FormField"
import { Button, buttonVariants } from "@/components/ui/button"
import type { CategoriaInput } from "@/types/categoria"

type Errors = Partial<Record<keyof CategoriaInput, string>>

type Props = {
  initial?: CategoriaInput
  saving: boolean
  fieldErrors?: Errors
  submitLabel: string
  onSubmit: (values: CategoriaInput) => void
}

function validate(v: CategoriaInput): Errors {
  const e: Errors = {}
  if (v.nome.trim().length < 2) e.nome = "Informe o nome da categoria."
  if (v.descricao.length > 255) e.descricao = "A descrição deve ter no máximo 255 caracteres."
  return e
}

export default function CategoriaForm({ initial = { nome: "", descricao: "" }, saving, fieldErrors = {}, submitLabel, onSubmit }: Props) {
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
      <div className="flex justify-end gap-2 pt-2">
        <Link to="/categorias" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Cancelar
        </Link>
        <Button type="submit" size="lg" disabled={saving}>
          {saving && <Loader2 className="animate-spin" />}
          {saving ? "Salvando…" : submitLabel}
        </Button>
      </div>
    </form>
  )
}
