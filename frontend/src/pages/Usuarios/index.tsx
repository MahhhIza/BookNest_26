import { useEffect, useState } from "react"
import Botao from "@/components/Botao"
import DataTable, { type Column } from "@/components/DataTable"
import FormAlert from "@/components/FormAlert"
import PageHeader from "@/components/PageHeader"
import { useAuth } from "@/hooks/useAuth"
import { usePageTitle } from "@/hooks/usePageTitle"
import { ApiError, changeUserRole, listUsers, type Papel, type Usuario } from "@/services/api"

export default function Usuarios() {
  usePageTitle("Usuários")
  const { usuario: eu } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [salvandoId, setSalvandoId] = useState<number | null>(null)

  useEffect(() => {
    let cancelado = false
    listUsers()
      .then((lista) => !cancelado && setUsuarios(lista))
      .catch((err) => !cancelado && setErro(err instanceof ApiError ? err.message : "Não foi possível carregar os usuários."))
      .finally(() => !cancelado && setCarregando(false))
    return () => {
      cancelado = true
    }
  }, [])

  async function mudarPapel(alvo: Usuario, papel: Papel) {
    setErro("")
    setSalvandoId(alvo.id)
    try {
      const atualizado = await changeUserRole(alvo.id, papel)
      setUsuarios((lista) => lista.map((u) => (u.id === atualizado.id ? atualizado : u)))
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível mudar o papel.")
    } finally {
      setSalvandoId(null)
    }
  }

  const colunas: Column<Usuario>[] = [
    { header: "Nome", cell: (u) => <span className="destaque">{u.nome}</span> },
    { header: "E-mail", cell: (u) => <span className="texto-mudo">{u.email}</span>, hideOnMobile: true },
    {
      header: "Papel",
      cell: (u) => <span className={`selo ${u.papel === "admin" ? "selo-admin" : ""}`.trim()}>{u.papel === "admin" ? "Administrador" : "Usuário"}</span>,
    },
    {
      header: "Ações",
      className: "col-direita",
      cell: (u) => {
        if (u.id === eu?.id) return <span className="texto-mudo">Você</span>
        const ehAdmin = u.papel === "admin"
        return (
          <Botao variante={ehAdmin ? "contorno" : "principal"} tamanho="pequeno" disabled={salvandoId === u.id} onClick={() => mudarPapel(u, ehAdmin ? "usuario" : "admin")}>
            {ehAdmin ? "Tirar admin" : "Tornar admin"}
          </Botao>
        )
      },
    },
  ]

  return (
    <div className="pagina">
      <PageHeader title="Usuários" description="Veja quem tem conta e escolha quem é administrador." />
      {erro && <FormAlert>{erro}</FormAlert>}
      {carregando ? (
        <p className="carregando">Carregando…</p>
      ) : (
        <div className="tabela-caixa">
          <DataTable columns={colunas} rows={usuarios} getKey={(u) => u.id} emptyMessage="Nenhum usuário encontrado." />
        </div>
      )}
    </div>
  )
}
