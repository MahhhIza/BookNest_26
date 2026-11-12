import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import Botao from "@/components/Botao"
import ConfirmDialog from "@/components/ConfirmDialog"
import DataTable, { type Column } from "@/components/DataTable"
import FormAlert from "@/components/FormAlert"
import Icone from "@/components/Icone"
import PageHeader from "@/components/PageHeader"
import Pagination from "@/components/Pagination"
import { useAuth } from "@/hooks/useAuth"
import { usePaginatedList } from "@/hooks/usePaginatedList"
import { ApiError } from "@/services/api"
import type { ICrudService } from "@/types/crud"
import { classeBotao } from "@/utils/botao"

type Props<T extends { id: number }, TInput> = {
  title: string
  description: string
  entityName: string
  basePath: string
  newPath: string
  newLabel: string
  emptyMessage: string
  service: ICrudService<T, TInput>
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
    className: "col-direita col-acoes",
    cell: (row) => (
      <div className="acoes-linha">
        <Link to={`${basePath}/${row.id}/editar`} aria-label={`Editar ${itemLabel(row)}`} className={classeBotao("contorno", "pequeno")}>
          <Icone nome="lapis" /> <span className="esconde-celular">Editar</span>
        </Link>
        <Botao variante="perigo" tamanho="pequeno" onClick={() => setAlvo(row)} aria-label={`Excluir ${itemLabel(row)}`}>
          <Icone nome="lixeira" />
        </Botao>
      </div>
    ),
  }

  const colunas = isAdmin ? [...columns, colunaAcoes] : columns

  return (
    <div className="pagina">
      <PageHeader
        title={title}
        description={description}
        action={
          isAdmin && (
            <Link to={newPath} className={classeBotao("principal", "grande")}>
              <Icone nome="mais" /> {newLabel}
            </Link>
          )
        }
      />

      {!isAdmin && <p className="aviso">Você está só consultando. Para cadastrar, editar ou excluir, entre como administrador.</p>}

      {galeria && (
        <div className="alternador" role="group" aria-label="Forma de exibir">
          <Botao variante="fantasma" tamanho="pequeno" onClick={() => setModo("capas")} aria-pressed={modo === "capas"}>
            <Icone nome="capas" /> Capas
          </Botao>
          <Botao variante="fantasma" tamanho="pequeno" onClick={() => setModo("lista")} aria-pressed={modo === "lista"}>
            <Icone nome="lista" /> Lista
          </Botao>
        </div>
      )}

      {(error || erroExclusao) && <FormAlert>{error || erroExclusao}</FormAlert>}

      {loading ? (
        <p className="carregando">Carregando…</p>
      ) : (
        <div className="lista-blocos">
          {galeria && modo === "capas" ? (
            rows.length === 0 ? (
              <p className="lista-vazia">{emptyMessage}</p>
            ) : (
              galeria(rows)
            )
          ) : (
            <div className="tabela-caixa">
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
