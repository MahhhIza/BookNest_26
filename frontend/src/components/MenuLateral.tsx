import { BookMarked, BookOpen, ChartColumn, House, PenLine, Tags } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import Logo from "@/components/Logo"
import UserMenu from "@/components/UserMenu"

const LINKS = [
  { to: "/", label: "Início", icon: House, end: true },
  { to: "/livros", label: "Livros", icon: BookOpen, end: false },
  { to: "/autores", label: "Autores", icon: PenLine, end: false },
  { to: "/categorias", label: "Categorias", icon: Tags, end: false },
  { to: "/leituras", label: "Leituras", icon: BookMarked, end: false },
  { to: "/estatisticas", label: "Estatísticas", icon: ChartColumn, end: false },
]

export default function MenuLateral({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 bg-primary p-4 text-primary-foreground">
      <Link to="/" aria-label="BookNest – início" onClick={onNavegar} className="self-start">
        <Logo onDark className="h-16 w-auto" />
      </Link>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Principal">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavegar}
            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-white/15 text-primary-foreground" : "text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"}`}
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/15 pt-4">
        <UserMenu mostrarNome />
      </div>
    </div>
  )
}
