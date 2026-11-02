import { Loader2 } from "lucide-react"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import FormAlert from "@/components/FormAlert"
import FormField from "@/components/FormField"
import PasswordField from "@/components/PasswordField"
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { ApiError, getProfile, updateProfile } from "@/services/api"
import { formatCpf, isStrongPassword, isValidCpf, onlyDigits } from "@/utils/validators"

type Form = { nome: string; cpf: string; senha: string; confirmarSenha: string }
type Errors = Partial<Record<keyof Form, string>>

const EMPTY: Form = { nome: "", cpf: "", senha: "", confirmarSenha: "" }

function validate(f: Form): Errors {
  const e: Errors = {}
  if (f.nome.trim().split(/\s+/).length < 2) e.nome = "Informe seu nome e sobrenome."
  if (!f.cpf) e.cpf = "Informe seu CPF."
  else if (!isValidCpf(f.cpf)) e.cpf = "CPF inválido."
  if (f.senha || f.confirmarSenha) {
    if (!isStrongPassword(f.senha)) e.senha = "A senha ainda não atende todos os requisitos."
    if (f.confirmarSenha !== f.senha) e.confirmarSenha = "As senhas não coincidem."
  }
  return e
}

export default function ProfileForm() {
  const { atualizarUsuario } = useAuth()
  const [email, setEmail] = useState("")
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [apiError, setApiError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelado = false
    getProfile()
      .then((p) => {
        if (cancelado) return
        setEmail(p.email)
        setForm({ ...EMPTY, nome: p.nome, cpf: formatCpf(p.cpf) })
      })
      .catch((err) => !cancelado && setApiError(err instanceof ApiError ? err.message : "Não foi possível carregar seu perfil."))
      .finally(() => !cancelado && setLoadingData(false))
    return () => {
      cancelado = true
    }
  }, [])

  const set = (field: keyof Form) => (ev: ChangeEvent<HTMLInputElement>) => {
    const value = field === "cpf" ? formatCpf(ev.target.value) : ev.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSuccess(false)
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    setApiError("")
    setSuccess(false)
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    try {
      const atualizado = await updateProfile({
        nome: form.nome.trim(),
        cpf: onlyDigits(form.cpf),
        ...(form.senha ? { senha: form.senha } : {}),
      })
      atualizarUsuario({ id: atualizado.id, nome: atualizado.nome, email: atualizado.email })
      setForm((prev) => ({ ...prev, senha: "", confirmarSenha: "" }))
      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors((prev) => ({ ...prev, ...(err.fieldErrors as Errors) }))
        setApiError(err.message)
      } else {
        setApiError("Erro inesperado. Tente novamente.")
      }
    } finally {
      setSaving(false)
    }
  }

  if (loadingData) return <p className="text-sm text-muted-foreground">Carregando seus dados…</p>

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {success && <FormAlert variant="success">Perfil atualizado com sucesso!</FormAlert>}
      {apiError && <FormAlert>{apiError}</FormAlert>}
      <FormField label="Nome completo" name="nome" autoComplete="name" value={form.nome} onChange={set("nome")} error={errors.nome} />
      <FormField label="Email" name="email" value={email} readOnly disabled hint="O email não pode ser alterado." />
      <FormField label="CPF" name="cpf" inputMode="numeric" placeholder="000.000.000-00" value={form.cpf} onChange={set("cpf")} error={errors.cpf} />
      <div className="space-y-4 border-t pt-4">
        <p className="text-sm text-muted-foreground">Para trocar a senha, preencha os campos abaixo. Se não quiser trocar, deixe em branco.</p>
        <PasswordField label="Nova senha" name="senha" autoComplete="new-password" value={form.senha} onChange={set("senha")} error={errors.senha} />
        <PasswordStrengthMeter password={form.senha} />
        <PasswordField label="Confirmar nova senha" name="confirmarSenha" autoComplete="new-password" value={form.confirmarSenha} onChange={set("confirmarSenha")} error={errors.confirmarSenha} />
      </div>
      <Button type="submit" size="lg" className="h-10 w-full" disabled={saving}>
        {saving && <Loader2 className="animate-spin" />}
        {saving ? "Salvando…" : "Salvar alterações"}
      </Button>
    </form>
  )
}
