import { usePageTitle } from "@/hooks/usePageTitle"
import ProfileForm from "./components/ProfileForm"

export default function Profile() {
  usePageTitle("Meu perfil")
  return (
    <section className="cartao cartao-estreito">
      <div className="cartao-cabecalho">
        <h1 className="cartao-titulo">Meu perfil</h1>
        <p className="cartao-descricao">Atualize seus dados pessoais.</p>
      </div>
      <div className="cartao-corpo">
        <ProfileForm />
      </div>
    </section>
  )
}
