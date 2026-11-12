import { useMemo } from "react"
import { Link } from "react-router-dom"
import Icone from "@/components/Icone"
import ResumoBiblioteca from "@/components/ResumoBiblioteca"
import { useAllRecords } from "@/hooks/useAllRecords"
import { useAuth } from "@/hooks/useAuth"
import { usePageTitle } from "@/hooks/usePageTitle"
import { autorService } from "@/services/autorService"
import { leituraService } from "@/services/leituraService"
import { livroService } from "@/services/livroService"
import type { StatusLeitura } from "@/types/leitura"
import { classeBotao } from "@/utils/botao"
import { calcularResumo } from "@/utils/estatisticas"
import CapasLeituras from "./components/CapasLeituras"
import Estante from "./components/Estante"

export default function Home() {
  const { usuario, isAdmin } = useAuth()
  usePageTitle("Minha biblioteca")
  const primeiroNome = usuario?.nome.split(" ")[0]
  const { records: livros, byId: livrosPorId, loading } = useAllRecords(livroService)
  const { records: leituras } = useAllRecords(leituraService)
  const { byId: autoresPorId } = useAllRecords(autorService)

  const resumo = useMemo(() => calcularResumo(livros, leituras), [livros, leituras])
  const lidos = useMemo(() => new Set(leituras.filter((l) => l.status === "Lido").map((l) => l.livroId)), [leituras])

  const itens = (status: StatusLeitura) =>
    leituras.flatMap((l) => {
      const livro = livrosPorId.get(l.livroId)
      return l.status === status && livro ? [{ id: l.id, livro, autor: autoresPorId.get(livro.autorId)?.nome ?? "" }] : []
    })

  return (
    <div className="home">
      <div className="home-topo">
        <div>
          <h1>Olá, {primeiroNome}</h1>
          <p>Veja como está a sua biblioteca hoje.</p>
        </div>
        <ResumoBiblioteca resumo={resumo} />
      </div>

      <CapasLeituras titulo="Lendo agora" vazio="Você não está lendo nada no momento." editavel={isAdmin} itens={itens("Lendo")} />

      <section className="secao">
        <h2>Sua estante</h2>
        {loading ? (
          <p className="carregando">Arrumando a estante…</p>
        ) : livros.length === 0 ? (
          <div className="secao-vazia">
            <p>Nenhum livro por aqui ainda.</p>
            {isAdmin && (
              <Link to="/livros/novo" className={classeBotao("principal", "grande")}>
                <Icone nome="mais" /> Cadastrar livro
              </Link>
            )}
          </div>
        ) : (
          <>
            <Estante livros={livros} lidos={lidos} editavel={isAdmin} />
            <p className="aviso">Cada lombada é um livro. Quanto mais alta, mais páginas, e as mais apagadas são as que você ainda não leu.</p>
          </>
        )}
      </section>

      <CapasLeituras titulo="Na fila" vazio="Sua fila de leitura está vazia." editavel={isAdmin} itens={itens("Quero ler")} />
    </div>
  )
}
