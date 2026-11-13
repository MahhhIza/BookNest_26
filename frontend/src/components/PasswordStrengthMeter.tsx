import Icone from "@/components/Icone"
import { passwordStrength } from "@/utils/validators"

const RULES = [
  { key: "minLength", text: "8 ou mais caracteres" },
  { key: "upper", text: "Letra maiúscula" },
  { key: "lower", text: "Letra minúscula" },
  { key: "number", text: "Número" },
] as const

export default function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null
  const { score, label, checks } = passwordStrength(password)
  return (
    <div className="forca" aria-live="polite">
      <div className="forca-linha">
        <div className="forca-trilho">
          <div className={`forca-barra forca-${score}`} style={{ width: `${(score + 1) * 20}%` }} />
        </div>
        <span>{label}</span>
      </div>
      <ul className="forca-regras">
        {RULES.map(({ key, text }) => (
          <li key={key} className={`forca-regra ${checks[key] ? "ok" : ""}`.trim()}>
            <Icone nome={checks[key] ? "ok" : "circulo"} tamanho={12} />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
