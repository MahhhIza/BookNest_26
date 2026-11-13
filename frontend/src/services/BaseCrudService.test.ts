import { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ApiError, api } from "@/services/api"
import { BaseCrudService } from "@/services/BaseCrudService"
import { normalizarPagina } from "@/services/paginacao"

interface Categoria {
  id: number
  nome: string
}

class CategoriaTeste extends BaseCrudService<Categoria> {
  protected readonly caminho = "/categorias"
  protected readonly dadosIniciais: Categoria[]

  constructor(seed: Categoria[] = []) {
    super()
    this.dadosIniciais = seed
  }
}

let ultima: InternalAxiosRequestConfig | undefined

function responder(status: number, corpo: unknown) {
  api.defaults.adapter = async (config) => {
    ultima = config
    const resposta = { data: corpo, status, statusText: "", headers: {}, config }
    if (status >= 400) throw new AxiosError("falhou", "ERR_BAD_REQUEST", config, null, resposta)
    return resposta
  }
}

beforeEach(() => {
  ultima = undefined
  vi.stubEnv("VITE_MOCK", "false")
})
afterEach(() => vi.unstubAllEnvs())

describe("BaseCrudService (API real)", () => {
  it("lista com paginação na query", async () => {
    responder(200, { data: [], page: 2, limit: 5, total: 0, totalPages: 0 })
    await new CategoriaTeste().list(2, 5)
    expect(ultima?.url).toBe("/categorias")
    expect(ultima?.params).toEqual({ page: 2, limit: 5 })
  })

  it("cria com POST e corpo JSON", async () => {
    responder(201, { id: 1, nome: "Romance" })
    await new CategoriaTeste().create({ nome: "Romance" })
    expect(ultima?.method).toBe("post")
    expect(ultima?.url).toBe("/categorias")
    expect(JSON.parse(ultima?.data)).toEqual({ nome: "Romance" })
  })

  it("remove com DELETE no id", async () => {
    responder(204, null)
    await new CategoriaTeste().remove(7)
    expect(ultima?.method).toBe("delete")
    expect(ultima?.url).toBe("/categorias/7")
  })

  it("manda o token do localStorage no header Authorization", async () => {
    vi.stubGlobal("localStorage", { getItem: () => "abc123", removeItem: () => undefined })
    responder(200, { data: [], page: 1, limit: 10, total: 0, totalPages: 0 })
    await new CategoriaTeste().list()
    expect(ultima?.headers.Authorization).toBe("Bearer abc123")
    vi.unstubAllGlobals()
  })

  it("converte erro da API em ApiError com a mensagem do backend", async () => {
    responder(404, { message: "Categoria não encontrada." })
    const servico = new CategoriaTeste()
    await expect(servico.get(99)).rejects.toMatchObject({ status: 404, message: "Categoria não encontrada." })
    await expect(servico.get(99)).rejects.toBeInstanceOf(ApiError)
  })
})

describe("normalizarPagina", () => {
  it("aceita o formato com meta", () => {
    const pagina = normalizarPagina({ data: [1, 2], meta: { page: 2, limit: 2, total: 5, totalPages: 3 } }, 1, 10)
    expect(pagina).toEqual({ data: [1, 2], page: 2, limit: 2, total: 5, totalPages: 3 })
  })

  it("aceita o formato plano", () => {
    const pagina = normalizarPagina({ data: [1], page: 1, limit: 10, total: 1, totalPages: 1 }, 1, 10)
    expect(pagina).toEqual({ data: [1], page: 1, limit: 10, total: 1, totalPages: 1 })
  })
})

describe("BaseCrudService (modo demonstração)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_MOCK", "true")
    const dados = new Map<string, string>()
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => dados.get(k) ?? null,
      setItem: (k: string, v: string) => void dados.set(k, v),
    })
  })
  afterEach(() => vi.unstubAllGlobals())

  const seed = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, nome: `Cat ${i + 1}` }))

  it("pagina a lista inicial", async () => {
    const s = new CategoriaTeste(seed)
    const pagina2 = await s.list(2, 10)
    expect(pagina2).toMatchObject({ total: 12, totalPages: 2, page: 2 })
    expect(pagina2.data).toHaveLength(2)
  })

  it("cria, edita e exclui; id inexistente dá 404", async () => {
    const s = new CategoriaTeste(seed)
    const nova = await s.create({ nome: "Nova" })
    expect(nova.id).toBe(13)
    await s.update(13, { nome: "Editada" })
    expect((await s.get(13)).nome).toBe("Editada")
    await s.remove(13)
    await expect(s.get(13)).rejects.toMatchObject({ status: 404 })
    await expect(s.update(999, { nome: "x" })).rejects.toMatchObject({ status: 404 })
  })
})
