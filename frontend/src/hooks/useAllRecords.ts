import { useEffect, useMemo, useState } from "react"
import type { CrudService } from "@/services/crudService"

export function useAllRecords<T extends { id: number }, TInput>(service: CrudService<T, TInput>) {
  const [records, setRecords] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelado = false
    service
      .all()
      .then((rows) => !cancelado && setRecords(rows))
      .catch(() => !cancelado && setRecords([]))
      .finally(() => !cancelado && setLoading(false))
    return () => {
      cancelado = true
    }
  }, [service])

  const byId = useMemo(() => new Map(records.map((r) => [r.id, r])), [records])
  return { records, byId, loading }
}
