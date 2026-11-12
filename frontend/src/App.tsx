import { Route, Routes } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import AutorForm from "@/pages/AutorForm"
import Autores from "@/pages/Autores"
import CategoriaForm from "@/pages/CategoriaForm"
import Categorias from "@/pages/Categorias"
import Estatisticas from "@/pages/Estatisticas"
import Home from "@/pages/Home"
import LeituraForm from "@/pages/LeituraForm"
import Leituras from "@/pages/Leituras"
import LivroForm from "@/pages/LivroForm"
import Livros from "@/pages/Livros"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Profile from "@/pages/Profile"
import Register from "@/pages/Register"
import AdminRoute from "@/routes/AdminRoute"
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
          <Route path="/livros" element={<Livros />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/leituras" element={<Leituras />} />
          <Route element={<AdminRoute />}>
            <Route path="/categorias/nova" element={<CategoriaForm />} />
            <Route path="/categorias/:id/editar" element={<CategoriaForm />} />
            <Route path="/livros/novo" element={<LivroForm />} />
            <Route path="/livros/:id/editar" element={<LivroForm />} />
            <Route path="/autores/novo" element={<AutorForm />} />
            <Route path="/autores/:id/editar" element={<AutorForm />} />
            <Route path="/leituras/nova" element={<LeituraForm />} />
            <Route path="/leituras/:id/editar" element={<LeituraForm />} />
          </Route>
          <Route path="/estatisticas" element={<Estatisticas />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
