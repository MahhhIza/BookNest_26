import type { ReactNode } from "react"

type Props = { title: string; description?: string; action?: ReactNode }

export default function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-medium">{title}</h1>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
