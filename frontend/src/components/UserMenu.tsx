import { LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"

function initials(nome: string) {
  const parts = nome.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

export default function UserMenu() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  if (!usuario) return null

  function sair() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Menu do usuário">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">{initials(usuario.nome)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="font-medium text-foreground">{usuario.nome}</span>
            <span className="text-xs font-normal text-muted-foreground">{usuario.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/perfil")}>
          <User /> Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={sair}>
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
