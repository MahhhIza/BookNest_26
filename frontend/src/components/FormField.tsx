import type { ComponentProps, ReactNode } from "react"

export type FormFieldProps = ComponentProps<"input"> & {
  label: string
  error?: string
  hint?: string
  endAdornment?: ReactNode
}

export default function FormField({ label, error, hint, endAdornment, id, name, ...rest }: FormFieldProps) {
  const inputId = id ?? name
  return (
    <div className="campo-grupo">
      <label className="rotulo" htmlFor={inputId}>
        {label}
      </label>
      <div className={endAdornment ? "campo-envolve" : undefined}>
        <input id={inputId} name={name} className="campo" aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined} {...rest} />
        {endAdornment && <div className="campo-lateral">{endAdornment}</div>}
      </div>
      {!error && hint && <p className="campo-dica">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="campo-erro">
          {error}
        </p>
      )}
    </div>
  )
}
