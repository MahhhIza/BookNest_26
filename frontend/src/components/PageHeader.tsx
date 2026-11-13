import type { ReactNode } from "react"

type Props = { title: string; description?: string; action?: ReactNode }

export default function PageHeader({ title, description, action }: Props) {
  return (
    <div className="cabecalho-pagina">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}
