import { useCallback, useEffect, useState } from "react"
import { ApiError } from "@/services/api"
import type { CrudService } from "@/services/crudService"
import type { Paginated } from "@/types/pagination"

type State<T> = { loading: boolean; error: string; result: Paginated<T> | null }

export function usePaginatedList<T extends { id: number }, TInput>(service: CrudService<T, TInput>, limit = 10) {
  const [page, setPage] = useState(1)
  const [tick, setTick] = useState(0)
  const [state, setState] = useState<State<T>>({ loading: true, error: "", result: null })

  useEffect(() => {
    let cancelado = false
    service
      .list(page, limit)
      .then((result) => !cancelado && setState({ loading: false, error: "", result }))
      .catch((err) => !cancelado && setState((s) => ({ ...s, loading: false, error: err instanceof ApiError ? err.message : "Não foi possível carregar a lista." })))
    return () => {
      cancelado = true
    }
  }, [service, page, limit, tick])

  const goToPage = useCallback((p: number) => {
    setState((s) => ({ ...s, loading: true }))
    setPage(p)
  }, [])

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true }))
    setTick((t) => t + 1)
  }, [])

  return { page, rows: state.result?.data ?? [], totalPages: state.result?.totalPages ?? 0, loading: state.loading, error: state.error, goToPage, reload }
}
