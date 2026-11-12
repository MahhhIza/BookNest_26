import type { ReactNode } from "react"
import Icone from "@/components/Icone"

export default function FormAlert({ variant = "error", children }: { variant?: "error" | "success"; children: ReactNode }) {
  const isError = variant === "error"
  return (
    <div role="alert" className={`alerta ${isError ? "alerta-erro" : "alerta-sucesso"}`}>
      <Icone nome={isError ? "alerta" : "sucesso"} />
      <span>{children}</span>
    </div>
  )
}
