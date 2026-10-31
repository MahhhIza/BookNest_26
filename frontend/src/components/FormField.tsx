import type { ComponentProps, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type FormFieldProps = ComponentProps<"input"> & {
  label: string
  error?: string
  hint?: string
  endAdornment?: ReactNode
}

export default function FormField({ label, error, hint, endAdornment, id, name, ...rest }: FormFieldProps) {
  const inputId = id ?? name
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <Input
          id={inputId}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`h-10 ${endAdornment ? "pr-10" : ""}`}
          {...rest}
        />
        {endAdornment && <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>}
      </div>
      {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
