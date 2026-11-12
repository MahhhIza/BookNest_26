import type { Paginated } from "@/types/pagination"

type Meta = { page?: number; limit?: number; total?: number; totalPages?: number }
type RespostaPaginada<T> = Meta & { data: T[]; meta?: Meta }

export function normalizarPagina<T>(corpo: RespostaPaginada<T>, page: number, limit: number): Paginated<T> {
  const origem = corpo.meta ?? corpo
  const total = origem.total ?? corpo.data.length
  return {
    data: corpo.data,
    page: origem.page ?? page,
    limit: origem.limit ?? limit,
    total,
    totalPages: origem.totalPages ?? Math.ceil(total / limit),
  }
}
