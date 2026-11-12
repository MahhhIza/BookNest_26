import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import Icone from "@/components/Icone"
import Logo from "@/components/Logo"
import MenuLateral from "@/components/MenuLateral"

export default function AppLayout() {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="app">
      <aside className="app-menu">
        <MenuLateral />
      </aside>

      <header className="app-topo">
        <Link to="/" aria-label="BookNest – início">
          <Logo onDark altura={40} />
        </Link>
        <button type="button" onClick={() => setAberto(true)} aria-label="Abrir menu" aria-expanded={aberto} className="app-topo-botao">
          <Icone nome="menu" tamanho={24} />
        </button>
      </header>

      {aberto && (
        <div className="gaveta" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" onClick={() => setAberto(false)} aria-label="Fechar menu" className="gaveta-fundo" />
          <div className="gaveta-painel">
            <MenuLateral onNavegar={() => setAberto(false)} />
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar menu" className="gaveta-fechar">
              <Icone nome="fechar" tamanho={20} />
            </button>
          </div>
        </div>
      )}

      <main className="app-conteudo">
        <Outlet />
      </main>
    </div>
  )
}
