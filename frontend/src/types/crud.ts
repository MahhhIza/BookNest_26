import type { Paginated } from "@/types/pagination"

export interface ICrudService<T extends { id: number }, TInput> {
  list(page?: number, limit?: number): Promise<Paginated<T>>
  all(): Promise<T[]>
  get(id: number): Promise<T>
  create(input: TInput): Promise<T>
  update(id: number, input: TInput): Promise<T>
  remove(id: number): Promise<null>
}
