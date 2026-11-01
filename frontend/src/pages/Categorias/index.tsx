import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import ConfirmDialog from "@/components/ConfirmDialog"
import DataTable, { type Column } from "@/components/DataTable"
import FormAlert from "@/components/FormAlert"
import PageHeader from "@/components/PageHeader"
import Pagination from "@/components/Pagination"
import { Button, buttonVariants } from "@/components/ui/button"
import { usePageTitle } from "@/hooks/usePageTitle"
import { usePaginatedList } from "@/hooks/usePaginatedList"
import { ApiError } from "@/services/api"
import { categoriaService } from "@/services/categoriaService"
import type { Categoria } from "@/types/categoria"

export default function Categorias() {
  usePageTitle("Categorias")
  const { rows, page, totalPages, loading, error, goToPage, reload } = usePaginatedList(categoriaService)
  const [alvo, setAlvo] = useState<Categoria | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState("")

  async function confirmarExclusao() {
    if (!alvo) return
    setExcluindo(true)
    setErroExclusao("")
    try {
      await categoriaService.remove(alvo.id)
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

  const colunas: Column<Categoria>[] = [
    { header: "Nome", cell: (c) => <span className="font-medium">{c.nome}</span> },
    { header: "Descrição", cell: (c) => <span className="text-muted-foreground">{c.descricao || "—"}</span> },
    {
      header: "Ações",
      className: "w-40 text-right",
      cell: (c) => (
        <div className="flex justify-end gap-2">
          <Link to={`/categorias/${c.id}/editar`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            <Pencil /> Editar
          </Link>
          <Button variant="destructive" size="sm" onClick={() => setAlvo(c)} aria-label={`Excluir ${c.nome}`}>
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorias"
        description="Organize seus livros por gênero."
        action={
          <Link to="/categorias/nova" className={buttonVariants({ size: "lg" })}>
            <Plus /> Nova categoria
          </Link>
        }
      />

      {(error || erroExclusao) && <FormAlert>{error || erroExclusao}</FormAlert>}

      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <div className="space-y-4 rounded-xl border bg-card p-2">
          <DataTable columns={colunas} rows={rows} getKey={(c) => c.id} emptyMessage="Você ainda não cadastrou nenhuma categoria." />
          <div className="px-2 pb-2">
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={alvo !== null}
        onOpenChange={(aberto) => !aberto && setAlvo(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${alvo?.nome}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={excluindo}
        onConfirm={confirmarExclusao}
      />
    </div>
  )
}
