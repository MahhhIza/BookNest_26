import { ApiError } from "@/services/api"
import type { Paginated } from "@/types/pagination"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class MockStore<T extends { id: number }, TInput> {
  private readonly key: string
  private readonly seed: T[]

  constructor(name: string, seed: T[] = []) {
    this.key = `booknest.mock.${name}`
    this.seed = seed
  }

  private read(): T[] {
    const raw = localStorage.getItem(this.key)
    if (raw) return JSON.parse(raw) as T[]
    this.write(this.seed)
    return this.seed
  }

  private write(rows: T[]) {
    localStorage.setItem(this.key, JSON.stringify(rows))
  }

  private notFound(): never {
    throw new ApiError("Registro não encontrado.", 404)
  }

  async list(page: number, limit: number): Promise<Paginated<T>> {
    await wait(250)
    const rows = this.read()
    const start = (page - 1) * limit
    return { data: rows.slice(start, start + limit), page, limit, total: rows.length, totalPages: Math.ceil(rows.length / limit) }
  }

  async get(id: number): Promise<T> {
    await wait(250)
    return this.read().find((r) => r.id === id) ?? this.notFound()
  }

  async create(input: TInput): Promise<T> {
    await wait(300)
    const rows = this.read()
    const novo = { ...input, id: Math.max(0, ...rows.map((r) => r.id)) + 1 } as unknown as T
    this.write([...rows, novo])
    return novo
  }

  async update(id: number, input: TInput): Promise<T> {
    await wait(300)
    const rows = this.read()
    if (!rows.some((r) => r.id === id)) this.notFound()
    const atualizado = { ...input, id } as unknown as T
    this.write(rows.map((r) => (r.id === id ? atualizado : r)))
    return atualizado
  }

  async remove(id: number): Promise<null> {
    await wait(300)
    const rows = this.read()
    if (!rows.some((r) => r.id === id)) this.notFound()
    this.write(rows.filter((r) => r.id !== id))
    return null
  }
}
