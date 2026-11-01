import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function PublicOnlyRoute() {
  const { token } = useAuth()
  return token ? <Navigate to="/" replace /> : <Outlet />
}
