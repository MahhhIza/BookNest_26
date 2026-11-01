import { CircleAlert, CircleCheck } from "lucide-react"
import type { ReactNode } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function FormAlert({ variant = "error", children }: { variant?: "error" | "success"; children: ReactNode }) {
  const isError = variant === "error"
  return (
    <Alert variant={isError ? "destructive" : "default"} className={isError ? "" : "border-emerald-200 bg-emerald-50 text-emerald-800"}>
      {isError ? <CircleAlert /> : <CircleCheck />}
      <AlertDescription className={isError ? "" : "text-emerald-800"}>{children}</AlertDescription>
    </Alert>
  )
}
