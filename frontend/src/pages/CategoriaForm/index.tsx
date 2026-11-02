import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import FormAlert from "@/components/FormAlert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePageTitle } from "@/hooks/usePageTitle"
import { ApiError } from "@/services/api"
import { categoriaService } from "@/services/categoriaService"
import type { CategoriaInput } from "@/types/categoria"
import CategoriaForm from "./components/CategoriaForm"

export default function CategoriaFormPage() {
  const { id } = useParams()
  const editando = id !== undefined
  usePageTitle(editando ? "Editar categoria" : "Nova categoria")
  const navigate = useNavigate()

  const [inicial, setInicial] = useState<CategoriaInput | undefined>(undefined)
  const [carregando, setCarregando] = useState(editando)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<CategoriaInput>>({})

  useEffect(() => {
    if (!editando) return
    let cancelado = false
    categoriaService
      .get(Number(id))
      .then((c) => !cancelado && setInicial({ nome: c.nome, descricao: c.descricao }))
      .catch((err) => !cancelado && setErro(err instanceof ApiError ? err.message : "Não foi possível carregar a categoria."))
      .finally(() => !cancelado && setCarregando(false))
    return () => {
      cancelado = true
    }
  }, [editando, id])

  async function salvar(values: CategoriaInput) {
    setSaving(true)
    setErro("")
    setFieldErrors({})
    try {
      if (editando) await categoriaService.update(Number(id), values)
      else await categoriaService.create(values)
      navigate("/categorias")
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors as Partial<CategoriaInput>)
        setErro(err.message)
      } else {
        setErro("Erro inesperado. Tente novamente.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">{editando ? "Editar categoria" : "Nova categoria"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {erro && <FormAlert>{erro}</FormAlert>}
        {carregando ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : editando && !inicial ? null : (
          <CategoriaForm initial={inicial} saving={saving} fieldErrors={fieldErrors} submitLabel={editando ? "Salvar alterações" : "Cadastrar"} onSubmit={salvar} />
        )}
      </CardContent>
    </Card>
  )
}
