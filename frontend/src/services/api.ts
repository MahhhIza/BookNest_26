import { getToken, USER_KEY } from "@/services/session"

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api"
export const isMock = () => import.meta.env.VITE_MOCK === "true"
const MOCK_PROFILE_KEY = "booknest.mock.perfil"

export type RegisterPayload = {
  nome: string
  email: string
  senha: string
  cpf: string
}

export type LoginPayload = { email: string; senha: string }

export type Usuario = { id: number; nome: string; email: string }
export type LoginResponse = { token: string; usuario: Usuario }

export type Perfil = Usuario & { cpf: string }
export type UpdateProfilePayload = { nome: string; cpf: string; senha?: string }

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Tente novamente.", 0)
  }

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(
      body?.message ?? body?.error ?? `Erro inesperado (${res.status}).`,
      res.status,
      body?.errors ?? {}
    )
  }
  return body as T
}

export async function registerUser(payload: RegisterPayload) {
  if (isMock()) {
    await wait(600)
    return { id: 1 }
  }
  return request<{ id: number }>("/usuarios", { method: "POST", body: JSON.stringify(payload) })
}

export async function loginUser(payload: LoginPayload) {
  if (isMock()) {
    await wait(600)
    const nome = payload.email.split("@")[0].replace(/[._-]+/g, " ")
    return { token: "token-demonstracao", usuario: { id: 1, nome: nome.replace(/\b\w/g, (c) => c.toUpperCase()), email: payload.email } } satisfies LoginResponse
  }
  return request<LoginResponse>("/login", { method: "POST", body: JSON.stringify(payload) })
}

function mockProfile(): Perfil {
  const salvo = localStorage.getItem(MOCK_PROFILE_KEY)
  if (salvo) return JSON.parse(salvo) as Perfil
  const usuario = JSON.parse(localStorage.getItem(USER_KEY) ?? "{}") as Usuario
  return { ...usuario, cpf: "52998224725" }
}

export async function getProfile() {
  if (isMock()) {
    await wait(300)
    return mockProfile()
  }
  return request<Perfil>("/usuarios/me")
}

export async function updateProfile(payload: UpdateProfilePayload) {
  if (isMock()) {
    await wait(600)
    const novo = { ...mockProfile(), nome: payload.nome, cpf: payload.cpf }
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(novo))
    return novo
  }
  return request<Perfil>("/usuarios/me", { method: "PUT", body: JSON.stringify(payload) })
}
