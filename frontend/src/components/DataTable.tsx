import type { ReactNode } from "react"

export type Column<T> = { header: string; cell: (row: T) => ReactNode; className?: string; hideOnMobile?: boolean }

const classeDaColuna = (c: { className?: string; hideOnMobile?: boolean }) => `${c.className ?? ""} ${c.hideOnMobile ? "esconde-mobile" : ""}`.trim()

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  getKey: (row: T) => string | number
  emptyMessage?: string
}

export default function DataTable<T>({ columns, rows, getKey, emptyMessage = "Nenhum registro encontrado." }: Props<T>) {
  return (
    <table className="tabela">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.header} className={classeDaColuna(c)}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="col-vazia">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={getKey(row)}>
              {columns.map((c) => (
                <td key={c.header} className={classeDaColuna(c)}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
