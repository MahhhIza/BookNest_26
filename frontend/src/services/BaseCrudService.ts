import { api, isMock } from "@/services/api"
import { MockStore } from "@/services/mockStore"
import { normalizarPagina } from "@/services/paginacao"
import type { ICrudService } from "@/types/crud"

export abstract class BaseCrudService<T extends { id: number }, TInput = Omit<T, "id">> implements ICrudService<T, TInput> {
  protected abstract readonly caminho: string
  protected abstract readonly dadosIniciais: T[]
  private armazenamento?: MockStore<T, TInput>

  protected get local(): MockStore<T, TInput> | undefined {
    if (!isMock()) return undefined
    this.armazenamento ??= new MockStore<T, TInput>(this.caminho, this.dadosIniciais)
    return this.armazenamento
  }

  protected preparar(input: TInput): TInput {
    return input
  }

  async list(page = 1, limit = 10) {
    if (this.local) return this.local.list(page, limit)
    const { data } = await api.get(this.caminho, { params: { page, limit } })
    return normalizarPagina<T>(data, page, limit)
  }

  async all() {
    if (this.local) return this.local.all()
    const { data } = await api.get(this.caminho, { params: { page: 1, limit: 100 } })
    return normalizarPagina<T>(data, 1, 100).data
  }

  async get(id: number) {
    if (this.local) return this.local.get(id)
    const { data } = await api.get<T>(`${this.caminho}/${id}`)
    return data
  }

  async create(input: TInput) {
    const dados = this.preparar(input)
    if (this.local) return this.local.create(dados)
    const { data } = await api.post<T>(this.caminho, dados)
    return data
  }

  async update(id: number, input: TInput) {
    const dados = this.preparar(input)
    if (this.local) return this.local.update(id, dados)
    const { data } = await api.put<T>(`${this.caminho}/${id}`, dados)
    return data
  }

  async remove(id: number) {
    if (this.local) return this.local.remove(id)
    await api.delete(`${this.caminho}/${id}`)
    return null
  }
}
