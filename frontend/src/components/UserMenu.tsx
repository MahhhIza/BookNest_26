import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Icone from "@/components/Icone"
import { useAuth } from "@/hooks/useAuth"

function initials(nome: string) {
  const parts = nome.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

export default function UserMenu({ mostrarNome = false }: { mostrarNome?: boolean }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return
    const fecharFora = (ev: MouseEvent) => {
      if (!raiz.current?.contains(ev.target as Node)) setAberto(false)
    }
    const fecharComEsc = (ev: KeyboardEvent) => ev.key === "Escape" && setAberto(false)
    document.addEventListener("mousedown", fecharFora)
    document.addEventListener("keydown", fecharComEsc)
    return () => {
      document.removeEventListener("mousedown", fecharFora)
      document.removeEventListener("keydown", fecharComEsc)
    }
  }, [aberto])

  if (!usuario) return null

  function irParaPerfil() {
    setAberto(false)
    navigate("/perfil")
  }

  function sair() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="usuario" ref={raiz}>
      <button type="button" className="usuario-botao" onClick={() => setAberto((a) => !a)} aria-label="Menu do usuário" aria-expanded={aberto} aria-haspopup="menu">
        <span className="avatar">{initials(usuario.nome)}</span>
        {mostrarNome && (
          <span className="usuario-nome">
            <span>{usuario.nome}</span>
            {usuario.papel === "admin" && <small>Administrador</small>}
          </span>
        )}
      </button>
      {aberto && (
        <div className="usuario-lista" role="menu">
          <div className="usuario-info">
            <strong>{usuario.nome}</strong>
            <small>{usuario.email}</small>
            {usuario.papel === "admin" && <small className="papel">Administrador</small>}
          </div>
          <button type="button" role="menuitem" className="usuario-item" onClick={irParaPerfil}>
            <Icone nome="usuario" /> Meu perfil
          </button>
          <button type="button" role="menuitem" className="usuario-item" onClick={sair}>
            <Icone nome="sair" /> Sair
          </button>
        </div>
      )}
    </div>
  )
}
