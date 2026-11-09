import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import Logo from "@/components/Logo"
import MenuLateral from "@/components/MenuLateral"

export default function AppLayout() {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="min-h-svh bg-background md:grid md:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-svh border-r-2 border-gold/60 md:block">
        <MenuLateral />
      </aside>

      <header className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-gold/60 bg-primary px-4 py-2 text-primary-foreground md:hidden">
        <Link to="/" aria-label="BookNest – início">
          <Logo onDark className="h-10 w-auto" />
        </Link>
        <button type="button" onClick={() => setAberto(true)} aria-label="Abrir menu" aria-expanded={aberto} className="rounded-lg p-2 hover:bg-white/10">
          <Menu className="size-6" />
        </button>
      </header>

      {aberto && (
        <div className="fixed inset-0 z-20 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" onClick={() => setAberto(false)} aria-label="Fechar menu" className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-y-0 left-0 w-64">
            <MenuLateral onNavegar={() => setAberto(false)} />
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar menu" className="absolute top-4 right-3 rounded-lg p-2 text-primary-foreground hover:bg-white/10">
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  )
}
