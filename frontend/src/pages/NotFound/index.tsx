import { Link } from "react-router-dom"
import { usePageTitle } from "@/hooks/usePageTitle"
import { classeBotao } from "@/utils/botao"

export default function NotFound() {
  usePageTitle("Página não encontrada")
  return (
    <main className="nao-encontrado">
      <h1>Página não encontrada</h1>
      <p>O endereço que você abriu não existe na BookNest.</p>
      <Link to="/" className={classeBotao("principal", "grande")}>
        Voltar ao início
      </Link>
    </main>
  )
}
