import { Link, NavLink } from "react-router-dom"
import Icone, { type NomeIcone } from "@/components/Icone"
import Logo from "@/components/Logo"
import UserMenu from "@/components/UserMenu"
import { useAuth } from "@/hooks/useAuth"

const LINKS: { to: string; label: string; icone: NomeIcone; end: boolean }[] = [
  { to: "/", label: "Início", icone: "casa", end: true },
  { to: "/livros", label: "Livros", icone: "livros", end: false },
  { to: "/autores", label: "Autores", icone: "autores", end: false },
  { to: "/categorias", label: "Categorias", icone: "categorias", end: false },
  { to: "/leituras", label: "Leituras", icone: "leituras", end: false },
  { to: "/estatisticas", label: "Estatísticas", icone: "estatisticas", end: false },
]

export default function MenuLateral({ onNavegar }: { onNavegar?: () => void }) {
  const { isAdmin } = useAuth()
    const renderLink = ({ to, label, icone, end }: (typeof LINKS)[number]) => (
    <NavLink key={to} to={to} end={end} onClick={onNavegar} className={({ isActive }) => `menu-link ${isActive ? "ativo" : ""}`.trim()}>
      <Icone nome={icone} tamanho={20} />
      {label}
    </NavLink>
  )

  return (
    <div className="menu-lateral">
      <Link to="/" aria-label="BookNest – início" onClick={onNavegar} className="menu-logo">
        <Logo onDark altura={96} />
      </Link>
      <nav className="menu-links" aria-label="Principal">
        <span className="menu-secao">Biblioteca</span>
        {LINKS.map(renderLink)}
        {isAdmin && (
          <>
            <span className="menu-secao">Administração</span>
            {renderLink({ to: "/usuarios", label: "Usuários", icone: "usuario", end: false })}
          </>
        )}
      </nav>
      <div className="menu-usuario">
        <UserMenu mostrarNome />
      </div>
    </div>
  )
}
