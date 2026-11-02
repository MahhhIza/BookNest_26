import { Check, Circle } from "lucide-react"
import { passwordStrength } from "@/utils/validators"

const BAR_COLORS = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"]

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
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div className={`h-full transition-all ${BAR_COLORS[score]}`} style={{ width: `${(score + 1) * 20}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {RULES.map(({ key, text }) => (
          <li key={key} className={`flex items-center gap-1.5 text-xs ${checks[key] ? "text-emerald-700" : "text-muted-foreground"}`}>
            {checks[key] ? <Check className="size-3" /> : <Circle className="size-3" />}
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
