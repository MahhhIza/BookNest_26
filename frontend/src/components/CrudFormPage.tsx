import { useEffect, useState, type ReactNode } from "react"
import { useNavigate, useParams } from "react-router-dom"
import FormAlert from "@/components/FormAlert"
import { usePageTitle } from "@/hooks/usePageTitle"
import { ApiError } from "@/services/api"
import type { ICrudService } from "@/types/crud"
import type { CrudFormProps } from "@/types/form"

type Props<T extends { id: number }, TInput> = {
  service: ICrudService<T, TInput>
  listPath: string
  entityName: string
  feminino?: boolean
  toInput: (row: T) => TInput
  children: (props: CrudFormProps<TInput>) => ReactNode
}

export default function CrudFormPage<T extends { id: number }, TInput>({ service, listPath, entityName, feminino = false, toInput, children }: Props<T, TInput>) {
  const { id } = useParams()
  const editando = id !== undefined
  const titulo = `${editando ? "Editar" : feminino ? "Nova" : "Novo"} ${entityName}`
  usePageTitle(titulo)
  const navigate = useNavigate()

  const [inicial, setInicial] = useState<TInput | undefined>(undefined)
  const [carregando, setCarregando] = useState(editando)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof TInput, string>>>({})

  useEffect(() => {
    if (!editando) return
    let cancelado = false
    service
      .get(Number(id))
      .then((row) => !cancelado && setInicial(toInput(row)))
      .catch((err) => !cancelado && setErro(err instanceof ApiError ? err.message : `Não foi possível carregar o registro.`))
      .finally(() => !cancelado && setCarregando(false))
    return () => {
      cancelado = true
    }
  }, [editando, id, service, toInput])

  async function salvar(values: TInput) {
    setSaving(true)
    setErro("")
    setFieldErrors({})
    try {
      if (editando) await service.update(Number(id), values)
      else await service.create(values)
      navigate(listPath)
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors as Partial<Record<keyof TInput, string>>)
        setErro(err.message)
      } else {
        setErro("Erro inesperado. Tente novamente.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="cartao cartao-estreito">
      <div className="cartao-cabecalho">
        <h1 className="cartao-titulo">{titulo}</h1>
      </div>
      <div className="cartao-corpo">
        {erro && <FormAlert>{erro}</FormAlert>}
        {carregando ? (
          <p className="aviso">Carregando…</p>
        ) : editando && !inicial ? null : (
          children({ initial: inicial, saving, fieldErrors, submitLabel: editando ? "Salvar alterações" : "Cadastrar", onSubmit: salvar })
        )}
      </div>
    </section>
  )
}
