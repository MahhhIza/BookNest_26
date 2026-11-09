import type { ReactNode } from "react"

type Props = { title: string; description?: string; action?: ReactNode }

export default function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
      {action}
    </div>
  )
}
