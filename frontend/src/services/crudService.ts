import { isMock, request } from "@/services/api"
import { MockStore } from "@/services/mockStore"
import type { Paginated } from "@/types/pagination"

export class CrudService<T extends { id: number }, TInput = Omit<T, "id">> {
  private readonly basePath: string
  private readonly mock?: MockStore<T, TInput>

  constructor(basePath: string, mockSeed: T[] = []) {
    this.basePath = basePath
    if (isMock()) this.mock = new MockStore<T, TInput>(basePath, mockSeed)
  }

  list(page = 1, limit = 10) {
    if (this.mock) return this.mock.list(page, limit)
    return request<Paginated<T>>(`${this.basePath}?page=${page}&limit=${limit}`)
  }

  get(id: number) {
    if (this.mock) return this.mock.get(id)
    return request<T>(`${this.basePath}/${id}`)
  }

  create(input: TInput) {
    if (this.mock) return this.mock.create(input)
    return request<T>(this.basePath, { method: "POST", body: JSON.stringify(input) })
  }

  update(id: number, input: TInput) {
    if (this.mock) return this.mock.update(id, input)
    return request<T>(`${this.basePath}/${id}`, { method: "PUT", body: JSON.stringify(input) })
  }

  remove(id: number) {
    if (this.mock) return this.mock.remove(id)
    return request<null>(`${this.basePath}/${id}`, { method: "DELETE" })
  }
}
