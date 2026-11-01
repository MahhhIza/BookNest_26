import { Link, NavLink, Outlet } from "react-router-dom"
import Logo from "@/components/Logo"
import UserMenu from "@/components/UserMenu"

const LINKS = [
  { to: "/", label: "Início", end: true },
  { to: "/categorias", label: "Categorias", end: false },
]

export default function AppLayout() {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-8">
            <Link to="/" aria-label="BookNest – início">
              <Logo className="h-12 w-auto" />
            </Link>
            <nav className="flex items-center gap-1" aria-label="Principal">
              {LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}
