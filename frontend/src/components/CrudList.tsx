import { LayoutGrid, List, Pencil, Plus, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import ConfirmDialog from "@/components/ConfirmDialog"
import DataTable, { type Column } from "@/components/DataTable"
import FormAlert from "@/components/FormAlert"
import PageHeader from "@/components/PageHeader"
import Pagination from "@/components/Pagination"
import { Button, buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { usePaginatedList } from "@/hooks/usePaginatedList"
import { ApiError } from "@/services/api"
import type { CrudService } from "@/services/crudService"

type Props<T extends { id: number }, TInput> = {
  title: string
  description: string
  entityName: string
  basePath: string
  newPath: string
  newLabel: string
  emptyMessage: string
  service: CrudService<T, TInput>
  columns: Column<T>[]
  itemLabel: (row: T) => string
  galeria?: (rows: T[]) => ReactNode
}

export default function CrudList<T extends { id: number }, TInput>({ title, description, entityName, basePath, newPath, newLabel, emptyMessage, service, columns, itemLabel, galeria }: Props<T, TInput>) {
  const { isAdmin } = useAuth()
  const { rows, page, totalPages, loading, error, goToPage, reload } = usePaginatedList(service)
  const [modo, setModo] = useState<"capas" | "lista">(galeria ? "capas" : "lista")
  const [alvo, setAlvo] = useState<T | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState("")

  async function confirmarExclusao() {
    if (!alvo) return
    setExcluindo(true)
    setErroExclusao("")
    try {
      await service.remove(alvo.id)
      setAlvo(null)
      if (rows.length === 1 && page > 1) goToPage(page - 1)
      else reload()
    } catch (err) {
      setErroExclusao(err instanceof ApiError ? err.message : "Não foi possível excluir.")
      setAlvo(null)
    } finally {
      setExcluindo(false)
    }
  }

  const colunaAcoes: Column<T> = {
    header: "Ações",
    className: "text-right md:w-40",
    cell: (row) => (
      <div className="flex justify-end gap-2">
        <Link to={`${basePath}/${row.id}/editar`} aria-label={`Editar ${itemLabel(row)}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Pencil /> <span className="hidden sm:inline">Editar</span>
        </Link>
        <Button variant="destructive" size="sm" onClick={() => setAlvo(row)} aria-label={`Excluir ${itemLabel(row)}`}>
          <Trash2 />
        </Button>
      </div>
    ),
  }

  const colunas = isAdmin ? [...columns, colunaAcoes] : columns

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          isAdmin && (
            <Link to={newPath} className={buttonVariants({ size: "lg" })}>
              <Plus /> {newLabel}
            </Link>
          )
        }
      />

      {!isAdmin && <p className="text-sm text-muted-foreground">Você está só consultando. Para cadastrar, editar ou excluir, entre como administrador.</p>}

      {galeria && (
        <div className="flex gap-1" role="group" aria-label="Forma de exibir">
          <Button variant={modo === "capas" ? "secondary" : "ghost"} size="sm" onClick={() => setModo("capas")} aria-pressed={modo === "capas"}>
            <LayoutGrid /> Capas
          </Button>
          <Button variant={modo === "lista" ? "secondary" : "ghost"} size="sm" onClick={() => setModo("lista")} aria-pressed={modo === "lista"}>
            <List /> Lista
          </Button>
        </div>
      )}

      {(error || erroExclusao) && <FormAlert>{error || erroExclusao}</FormAlert>}

      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <div className="space-y-4">
          {galeria && modo === "capas" ? (
            rows.length === 0 ? (
              <p className="py-10 text-center text-muted-foreground">{emptyMessage}</p>
            ) : (
              galeria(rows)
            )
          ) : (
            <div className="rounded-xl border bg-card p-2">
              <DataTable columns={colunas} rows={rows} getKey={(r) => r.id} emptyMessage={emptyMessage} />
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
        </div>
      )}

      <ConfirmDialog
        open={alvo !== null}
        onOpenChange={(aberto) => !aberto && setAlvo(null)}
        title={`Excluir ${entityName}`}
        description={`Tem certeza que deseja excluir "${alvo ? itemLabel(alvo) : ""}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={excluindo}
        onConfirm={confirmarExclusao}
      />
    </div>
  )
}
