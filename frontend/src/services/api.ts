import axios, { type AxiosError } from "axios"
import { clearSession, getToken, USER_KEY } from "@/services/session"

export const isMock = () => import.meta.env.DEV && import.meta.env.VITE_MOCK === "true"
const MOCK_PROFILE_KEY = "booknest.mock.perfil"
const ADMIN_DEMONSTRACAO = "admin@booknest.com"

export type RegisterPayload = {
  nome: string
  email: string
  senha: string
  cpf: string
}

export type LoginPayload = { email: string; senha: string }

export type Papel = "admin" | "usuario"
export interface Usuario {
  id: number
  nome: string
  email: string
  papel: Papel
}
export type LoginResponse = { token: string; usuario: Usuario }

export interface Perfil extends Usuario {
  cpf: string
}
export type UpdateProfilePayload = { nome: string; cpf: string; senha?: string }

type UsuarioApi = { id: number; name: string; email: string; cpf?: string; role?: "admin" | "user" }
type ErroApi = { message?: string; error?: string; errors?: Record<string, string> }

const paraUsuario = (u: UsuarioApi): Usuario => ({ id: u.id, nome: u.name, email: u.email, papel: u.role === "admin" ? "admin" : "usuario" })

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (resposta) => resposta,
  (erro: AxiosError<ErroApi>) => {
    if (!erro.response) {
      return Promise.reject(new ApiError("Não foi possível conectar ao servidor. Tente novamente.", 0))
    }
    const { status, data } = erro.response
    if (status === 401 && getToken()) {
      clearSession()
      window.location.assign("/login")
    }
    return Promise.reject(new ApiError(data?.message ?? data?.error ?? `Erro inesperado (${status}).`, status, data?.errors ?? {}))
  }
)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function registerUser(payload: RegisterPayload) {
  if (isMock()) {
    await wait(600)
    return { id: 1 }
  }
  const body = { name: payload.nome, email: payload.email, password: payload.senha, cpf: payload.cpf }
  const { data } = await api.post<{ id: number }>("/users", body)
  return data
}

export async function loginUser(payload: LoginPayload) {
  if (isMock()) {
    await wait(600)
    const nome = payload.email.split("@")[0].replace(/[._-]+/g, " ")
    const papel: Papel = payload.email.trim().toLowerCase() === ADMIN_DEMONSTRACAO ? "admin" : "usuario"
    return { token: "token-demonstracao", usuario: { id: 1, nome: nome.replace(/\b\w/g, (c) => c.toUpperCase()), email: payload.email, papel } } satisfies LoginResponse
  }
  const { data } = await api.post<{ token: string; user: UsuarioApi }>("/login", { email: payload.email, password: payload.senha })
  return { token: data.token, usuario: paraUsuario(data.user) } satisfies LoginResponse
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
  const { data } = await api.get<{ user: UsuarioApi }>("/users/me")
  return { ...paraUsuario(data.user), cpf: data.user.cpf ?? "" } satisfies Perfil
}

export async function updateProfile(payload: UpdateProfilePayload) {
  if (isMock()) {
    await wait(600)
    const novo = { ...mockProfile(), nome: payload.nome, cpf: payload.cpf }
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(novo))
    return novo
  }
  const body = { name: payload.nome, cpf: payload.cpf, ...(payload.senha ? { password: payload.senha } : {}) }
  const { data } = await api.put<{ user: UsuarioApi }>("/users/me", body)
  return { ...paraUsuario(data.user), cpf: data.user.cpf ?? payload.cpf } satisfies Perfil
}
