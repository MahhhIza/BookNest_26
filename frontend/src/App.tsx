import { Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import CategoriaForm from "@/pages/CategoriaForm"
import Categorias from "@/pages/Categorias"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Profile from "@/pages/Profile"
import Register from "@/pages/Register"
import ProtectedRoute from "@/routes/ProtectedRoute"
import PublicOnlyRoute from "@/routes/PublicOnlyRoute"

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/cadastro" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/nova" element={<CategoriaForm />} />
          <Route path="/categorias/:id/editar" element={<CategoriaForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
