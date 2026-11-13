import { Link, NavLink } from "react-router-dom"
import Icone, { type NomeIcone } from "@/components/Icone"
import Logo from "@/components/Logo"
import UserMenu from "@/components/UserMenu"

const LINKS: { to: string; label: string; icone: NomeIcone; end: boolean }[] = [
  { to: "/", label: "Início", icone: "casa", end: true },
  { to: "/livros", label: "Livros", icone: "livros", end: false },
  { to: "/autores", label: "Autores", icone: "autores", end: false },
  { to: "/categorias", label: "Categorias", icone: "categorias", end: false },
  { to: "/leituras", label: "Leituras", icone: "leituras", end: false },
  { to: "/estatisticas", label: "Estatísticas", icone: "estatisticas", end: false },
]

export default function MenuLateral({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <div className="menu-lateral">
      <Link to="/" aria-label="BookNest – início" onClick={onNavegar} className="menu-logo">
        <Logo onDark altura={64} />
      </Link>
      <nav className="menu-links" aria-label="Principal">
        {LINKS.map(({ to, label, icone, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavegar} className={({ isActive }) => `menu-link ${isActive ? "ativo" : ""}`.trim()}>
            <Icone nome={icone} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="menu-usuario">
        <UserMenu mostrarNome />
      </div>
    </div>
  )
}
