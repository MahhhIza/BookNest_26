import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Button, buttonVariants } from "@/components/ui/button"

type Props = { cancelTo: string; saving: boolean; submitLabel: string }

export default function FormActions({ cancelTo, saving, submitLabel }: Props) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Link to={cancelTo} className={buttonVariants({ variant: "outline", size: "lg" })}>
        Cancelar
      </Link>
      <Button type="submit" size="lg" disabled={saving}>
        {saving && <Loader2 className="animate-spin" />}
        {saving ? "Salvando…" : submitLabel}
      </Button>
    </div>
  )
}
