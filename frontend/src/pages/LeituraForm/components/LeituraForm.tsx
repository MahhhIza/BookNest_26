import { useState, type ChangeEvent, type FormEvent } from "react"
import FormActions from "@/components/FormActions"
import FormField from "@/components/FormField"
import SelectField from "@/components/SelectField"
import { useAllRecords } from "@/hooks/useAllRecords"
import { livroService } from "@/services/livroService"
import type { CrudFormProps } from "@/types/form"
import { STATUS_LEITURA, type LeituraInput, type StatusLeitura } from "@/types/leitura"

type Values = { livroId: string; status: StatusLeitura; nota: string; concluidaEm: string }
type Errors = Partial<Record<keyof LeituraInput, string>>

const hoje = () => new Date().toISOString().slice(0, 10)

const toValues = (l?: LeituraInput): Values => ({
  livroId: l ? String(l.livroId) : "",
  status: l?.status ?? "Quero ler",
  nota: l?.nota ? String(l.nota) : "",
  concluidaEm: l?.concluidaEm ?? "",
})

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.livroId) e.livroId = "Escolha o livro."
  if (v.status === "Lido") {
    const nota = Number(v.nota)
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) e.nota = "Dê uma nota de 1 a 5."
    if (!v.concluidaEm) e.concluidaEm = "Informe quando você terminou."
    else if (v.concluidaEm > hoje()) e.concluidaEm = "A data não pode estar no futuro."
  }
  return e
}

export default function LeituraForm({ initial, saving, fieldErrors = {}, submitLabel, onSubmit }: CrudFormProps<LeituraInput>) {
  const [values, setValues] = useState<Values>(toValues(initial))
  const [errors, setErrors] = useState<Errors>({})
  const { records: livros } = useAllRecords(livroService)

  const set = (field: keyof Values) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [field]: ev.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    const lido = values.status === "Lido"
    onSubmit({ livroId: Number(values.livroId), status: values.status, nota: lido ? Number(values.nota) : null, concluidaEm: lido ? values.concluidaEm : null })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="formulario">
      <SelectField label="Livro" name="livroId" placeholder="Escolha o livro" value={values.livroId} onChange={set("livroId")} options={livros.map((l) => ({ value: l.id, label: l.titulo }))} error={errors.livroId ?? fieldErrors.livroId} />
      <SelectField label="Status" name="status" value={values.status} onChange={set("status")} options={STATUS_LEITURA.map((s) => ({ value: s, label: s }))} error={errors.status ?? fieldErrors.status} />
      {values.status === "Lido" && (
        <div className="formulario-duas">
          <FormField label="Nota (1 a 5)" name="nota" type="number" min={1} max={5} value={values.nota} onChange={set("nota")} error={errors.nota ?? fieldErrors.nota} />
          <FormField label="Terminou em" name="concluidaEm" type="date" max={hoje()} value={values.concluidaEm} onChange={set("concluidaEm")} error={errors.concluidaEm ?? fieldErrors.concluidaEm} />
        </div>
      )}
      <FormActions cancelTo="/leituras" saving={saving} submitLabel={submitLabel} />
    </form>
  )
}
