import type { ComponentProps } from "react"

export type SelectOption = { value: number | string; label: string }

type Props = ComponentProps<"select"> & {
  label: string
  options: SelectOption[]
  placeholder?: string
  error?: string
}

export default function SelectField({ label, options, placeholder, error, id, name, ...rest }: Props) {
  const selectId = id ?? name
  return (
    <div className="campo-grupo">
      <label className="rotulo" htmlFor={selectId}>
        {label}
      </label>
      <select id={selectId} name={name} className="campo" aria-invalid={!!error} aria-describedby={error ? `${selectId}-error` : undefined} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} role="alert" className="campo-erro">
          {error}
        </p>
      )}
    </div>
  )
}
