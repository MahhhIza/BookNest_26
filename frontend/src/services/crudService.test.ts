import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ApiError } from "@/services/api"
import { CrudService } from "@/services/crudService"

type Categoria = { id: number; nome: string }

function mockFetch(status: number, body: unknown) {
  const fn = vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body })
  vi.stubGlobal("fetch", fn)
  return fn
}

beforeEach(() => vi.stubEnv("VITE_MOCK", "false"))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe("CrudService (API real)", () => {
  let categorias: CrudService<Categoria>
  beforeEach(() => {
    categorias = new CrudService<Categoria>("/categorias")
  })

  it("lista com paginação na query", async () => {
    const fetchMock = mockFetch(200, { data: [], page: 2, limit: 5, total: 0, totalPages: 0 })
    await categorias.list(2, 5)
    expect(fetchMock.mock.calls[0][0]).toBe("/api/categorias?page=2&limit=5")
  })

  it("cria com POST e corpo JSON", async () => {
    const fetchMock = mockFetch(201, { id: 1, nome: "Romance" })
    await categorias.create({ nome: "Romance" })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("/api/categorias")
    expect(init.method).toBe("POST")
    expect(init.body).toBe(JSON.stringify({ nome: "Romance" }))
  })

  it("remove com DELETE no id", async () => {
    const fetchMock = mockFetch(204, null)
    await categorias.remove(7)
    expect(fetchMock.mock.calls[0][0]).toBe("/api/categorias/7")
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE")
  })

  it("converte erro da API em ApiError com a mensagem do backend", async () => {
    mockFetch(404, { message: "Categoria não encontrada." })
    await expect(categorias.get(99)).rejects.toMatchObject({ status: 404, message: "Categoria não encontrada." })
    await expect(categorias.get(99)).rejects.toBeInstanceOf(ApiError)
  })
})

describe("CrudService (modo demonstração)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_MOCK", "true")
    const dados = new Map<string, string>()
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => dados.get(k) ?? null,
      setItem: (k: string, v: string) => void dados.set(k, v),
    })
  })

  const seed = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, nome: `Cat ${i + 1}` }))

  it("pagina a lista inicial", async () => {
    const s = new CrudService<Categoria>("/categorias", seed)
    const pagina2 = await s.list(2, 10)
    expect(pagina2).toMatchObject({ total: 12, totalPages: 2, page: 2 })
    expect(pagina2.data).toHaveLength(2)
  })

  it("cria, edita e exclui; id inexistente dá 404", async () => {
    const s = new CrudService<Categoria>("/categorias", seed)
    const nova = await s.create({ nome: "Nova" })
    expect(nova.id).toBe(13)
    await s.update(13, { nome: "Editada" })
    expect((await s.get(13)).nome).toBe("Editada")
    await s.remove(13)
    await expect(s.get(13)).rejects.toMatchObject({ status: 404 })
    await expect(s.update(999, { nome: "x" })).rejects.toMatchObject({ status: 404 })
  })
})
