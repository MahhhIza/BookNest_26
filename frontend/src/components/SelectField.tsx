import type { ComponentProps } from "react"
import { Label } from "@/components/ui/label"

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
    <div className="space-y-1.5">
      <Label htmlFor={selectId}>{label}</Label>
      <select
        id={selectId}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
