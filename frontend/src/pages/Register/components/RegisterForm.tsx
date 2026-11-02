import { Loader2 } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import FormAlert from "@/components/FormAlert"
import FormField from "@/components/FormField"
import PasswordField from "@/components/PasswordField"
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter"
import { Button } from "@/components/ui/button"
import { ApiError, registerUser } from "@/services/api"
import { formatCpf, isStrongPassword, isValidCpf, isValidEmail, onlyDigits } from "@/utils/validators"

type Form = { nome: string; email: string; cpf: string; senha: string; confirmarSenha: string }
type Errors = Partial<Record<keyof Form, string>>

const EMPTY: Form = { nome: "", email: "", cpf: "", senha: "", confirmarSenha: "" }

function validate(f: Form): Errors {
  const e: Errors = {}
  if (f.nome.trim().split(/\s+/).length < 2) e.nome = "Informe seu nome e sobrenome."
  if (!f.email.trim()) e.email = "Informe seu email."
  else if (!isValidEmail(f.email)) e.email = "Email inválido."
  if (!f.cpf) e.cpf = "Informe seu CPF."
  else if (!isValidCpf(f.cpf)) e.cpf = "CPF inválido."
  if (!f.senha) e.senha = "Crie uma senha."
  else if (!isStrongPassword(f.senha)) e.senha = "A senha ainda não atende todos os requisitos."
  if (!f.confirmarSenha) e.confirmarSenha = "Repita a senha."
  else if (f.confirmarSenha !== f.senha) e.confirmarSenha = "As senhas não coincidem."
  return e
}

export default function RegisterForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (field: keyof Form) => (ev: ChangeEvent<HTMLInputElement>) => {
    const value = field === "cpf" ? formatCpf(ev.target.value) : ev.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const blur = (field: keyof Form) => () => {
    const msg = validate(form)[field]
    setErrors((prev) => ({ ...prev, [field]: msg }))
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    setApiError("")
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      await registerUser({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
        cpf: onlyDigits(form.cpf),
      })
      navigate("/login", { state: { cadastrado: true } })
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors((prev) => ({ ...prev, ...(err.fieldErrors as Errors) }))
        setApiError(err.message)
      } else {
        setApiError("Erro inesperado. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {apiError && <FormAlert>{apiError}</FormAlert>}
      <FormField label="Nome completo" name="nome" autoComplete="name" value={form.nome} onChange={set("nome")} onBlur={blur("nome")} error={errors.nome} />
      <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" value={form.email} onChange={set("email")} onBlur={blur("email")} error={errors.email} />
      <FormField label="CPF" name="cpf" inputMode="numeric" placeholder="000.000.000-00" value={form.cpf} onChange={set("cpf")} onBlur={blur("cpf")} error={errors.cpf} />
      <PasswordField label="Senha" name="senha" autoComplete="new-password" value={form.senha} onChange={set("senha")} onBlur={blur("senha")} error={errors.senha} />
      <PasswordStrengthMeter password={form.senha} />
      <PasswordField label="Confirmar senha" name="confirmarSenha" autoComplete="new-password" value={form.confirmarSenha} onChange={set("confirmarSenha")} onBlur={blur("confirmarSenha")} error={errors.confirmarSenha} />
      <Button type="submit" size="lg" className="h-10 w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Cadastrando…" : "Criar conta"}
      </Button>
    </form>
  )
}
