import { Loader2 } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import FormAlert from "@/components/FormAlert"
import FormField from "@/components/FormField"
import PasswordField from "@/components/PasswordField"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { ApiError } from "@/services/api"
import { isValidEmail } from "@/utils/validators"

type Errors = { email?: string; senha?: string }

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    setApiError("")
    const found: Errors = {}
    if (!email.trim()) found.email = "Informe seu email."
    else if (!isValidEmail(email)) found.email = "Email inválido."
    if (!senha) found.senha = "Informe sua senha."
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      await login({ email: email.trim().toLowerCase(), senha })
      navigate("/", { replace: true })
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {apiError && <FormAlert>{apiError}</FormAlert>}
      <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <PasswordField label="Senha" name="senha" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} error={errors.senha} />
      <Button type="submit" size="lg" className="h-10 w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  )
}
