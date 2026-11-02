import { createContext, useCallback, useMemo, useState, type ReactNode } from "react"
import { loginUser, type LoginPayload, type Usuario } from "@/services/api"
import { getToken, TOKEN_KEY, USER_KEY } from "@/services/session"

export type AuthContextValue = {
  usuario: Usuario | null
  token: string | null
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  atualizarUsuario: (usuario: Usuario) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): Usuario | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as Usuario) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken)
  const [usuario, setUsuario] = useState<Usuario | null>(readStoredUser)

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginUser(payload)
    localStorage.setItem(TOKEN_KEY, res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.usuario))
    setToken(res.token)
    setUsuario(res.usuario)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUsuario(null)
  }, [])

  const atualizarUsuario = useCallback((novo: Usuario) => {
    localStorage.setItem(USER_KEY, JSON.stringify(novo))
    setUsuario(novo)
  }, [])

  const value = useMemo(() => ({ usuario, token, login, logout, atualizarUsuario }), [usuario, token, login, logout, atualizarUsuario])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
