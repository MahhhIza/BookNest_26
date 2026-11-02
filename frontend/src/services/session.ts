export const TOKEN_KEY = "booknest.token"
export const USER_KEY = "booknest.usuario"

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
