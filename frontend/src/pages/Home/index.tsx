import { BookPlus } from "lucide-react"
import { useMemo } from "react"
import { Link } from "react-router-dom"
import ResumoBiblioteca from "@/components/ResumoBiblioteca"
import { buttonVariants } from "@/components/ui/button"
import { useAllRecords } from "@/hooks/useAllRecords"
import { useAuth } from "@/hooks/useAuth"
import { usePageTitle } from "@/hooks/usePageTitle"
import { autorService } from "@/services/autorService"
import { leituraService } from "@/services/leituraService"
import { livroService } from "@/services/livroService"
import type { StatusLeitura } from "@/types/leitura"
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
    <div className="space-y-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Olá, {primeiroNome}</h1>
          <p className="mt-1 text-muted-foreground">Veja como está a sua biblioteca hoje.</p>
        </div>
        <ResumoBiblioteca resumo={resumo} />
      </div>

      <CapasLeituras titulo="Lendo agora" vazio="Você não está lendo nada no momento." editavel={isAdmin} itens={itens("Lendo")} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sua estante</h2>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Arrumando a estante…</p>
        ) : livros.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed p-8">
            <p className="text-muted-foreground">Nenhum livro por aqui ainda.</p>
            {isAdmin && (
              <Link to="/livros/novo" className={buttonVariants({ size: "lg" })}>
                <BookPlus /> Cadastrar livro
              </Link>
            )}
          </div>
        ) : (
          <>
            <Estante livros={livros} lidos={lidos} editavel={isAdmin} />
            <p className="text-sm text-muted-foreground">Cada lombada é um livro. Quanto mais alta, mais páginas, e as mais apagadas são as que você ainda não leu.</p>
          </>
        )}
      </section>

      <CapasLeituras titulo="Na fila" vazio="Sua fila de leitura está vazia." editavel={isAdmin} itens={itens("Quero ler")} />
    </div>
  )
}
