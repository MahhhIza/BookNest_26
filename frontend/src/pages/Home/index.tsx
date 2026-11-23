
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import Icone from "@/components/Icone"
import Botao from "@/components/Botao"
import ResumoBiblioteca from "@/components/ResumoBiblioteca"
import { useAllRecords } from "@/hooks/useAllRecords"
import { useAuth } from "@/hooks/useAuth"
import { usePageTitle } from "@/hooks/usePageTitle"
import { autorService } from "@/services/autorService"
import { leituraService } from "@/services/leituraService"
import { livroService } from "@/services/livroService"
import { pesquisarLivros, type LivroEncontrado } from "@/services/openLibraryService"
import {
  minhaEstanteService,
  type LivroMinhaEstante,
} from "@/services/minhaEstanteService"
import type { StatusLeitura } from "@/types/leitura"
import { classeBotao } from "@/utils/botao"
import { calcularResumo } from "@/utils/estatisticas"
import CapasLeituras from "./components/CapasLeituras"
import Estante from "./components/Estante"

export default function Home() {
  const { usuario, isAdmin } = useAuth()
  usePageTitle("Minha biblioteca")

  const primeiroNome = usuario?.nome.split(" ")[0]

  const [minhaEstante, setMinhaEstante] = useState<LivroMinhaEstante[]>([])
  const [carregandoEstante, setCarregandoEstante] = useState(true)
  const [termo, setTermo] = useState("")
  const [resultados, setResultados] = useState<LivroEncontrado[]>([])
  const [pesquisando, setPesquisando] = useState(false)
  const [adicionando, setAdicionando] = useState<string | null>(null)
  const [erro, setErro] = useState("")
  const [mensagem, setMensagem] = useState("")

  const { records: livros, byId: livrosPorId, loading } =
    useAllRecords(livroService)

  const { records: leituras } = useAllRecords(leituraService)
  const { byId: autoresPorId } = useAllRecords(autorService)

  const resumo = useMemo(
    () => calcularResumo(livros, leituras, minhaEstante),
    [livros, leituras, minhaEstante],
  )

  const lidos = useMemo(
    () =>
      new Set(
        leituras
          .filter(
            (leitura) =>
              leitura.status === "Lido" && leitura.livroId !== null
          )
          .map((leitura) => leitura.livroId as number)
      ),
    [leituras],
  )

  const lidosPessoais = useMemo(
    () =>
      new Set(
        leituras
          .filter(
            (leitura) =>
              leitura.status === "Lido" && leitura.openLibraryId !== null
          )
          .map((leitura) => leitura.openLibraryId as string)
      ),
    [leituras],
  )
  const itens = (status: StatusLeitura) =>
    leituras.flatMap((leitura) => {
      if (leitura.status !== status) return []

      if (leitura.livroId !== null) {
        const livro = livrosPorId.get(leitura.livroId)

        return livro
          ? [{
              id: leitura.id,
              livro: {
                titulo: livro.titulo,
                categoriaId: livro.categoriaId,
                capaUrl: livro.capaUrl,
              },
              autor: autoresPorId.get(livro.autorId)?.nome ?? "",
            }]
          : []
      }

      if (leitura.openLibraryId !== null) {
        const livroPessoal = minhaEstante.find(
          (livro) => livro.openLibraryId === leitura.openLibraryId
        )

        return [{
          id: leitura.id,
          livro: {
            titulo: leitura.livroTitulo || livroPessoal?.titulo || "Livro sem título",
            capaUrl: leitura.livroCapaUrl ?? livroPessoal?.capaUrl,
          },
          autor: livroPessoal?.autores.join(", ") || "Autor desconhecido",
        }]
      }

      return []
    })


  useEffect(() => {
    let ativo = true

    minhaEstanteService
      .listar()
      .then((livrosPessoais) => {
        if (ativo) {
          setMinhaEstante(livrosPessoais)
        }
      })
      .catch((erroCarregamento: unknown) => {
        if (ativo) {
          setErro(
            erroCarregamento instanceof Error
              ? erroCarregamento.message
              : "Não foi possível carregar sua estante pessoal.",
          )
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregandoEstante(false)
        }
      })

    return () => {
      ativo = false
    }
  }, [])

  async function buscarLivros(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (!termo.trim()) {
      setErro("Digite o nome de um livro ou autor para pesquisar.")
      return
    }

    setErro("")
    setMensagem("")
    setResultados([])
    setPesquisando(true)

    try {
      const resposta = await pesquisarLivros(termo, 5)
      setResultados(resposta.resultados)

      if (resposta.resultados.length === 0) {
        setMensagem("Nenhum livro encontrado. Tente outro termo.")
      }
    } catch (erroPesquisa) {
      setErro(
        erroPesquisa instanceof Error
          ? erroPesquisa.message
          : "Não foi possível pesquisar os livros.",
      )
    } finally {
      setPesquisando(false)
    }
  }

  async function adicionarLivro(livro: LivroEncontrado) {
    setErro("")
    setMensagem("")
    setAdicionando(livro.openLibraryId)

    try {
      const livroAdicionado = await minhaEstanteService.adicionar(livro)

      setMinhaEstante((atual) => [...atual, livroAdicionado])
      setMensagem(`"${livro.titulo}" foi adicionado à sua estante.`)
    } catch (erroAdicao) {
      setErro(
        erroAdicao instanceof Error
          ? erroAdicao.message
          : "Não foi possível adicionar o livro.",
      )
    } finally {
      setAdicionando(null)
    }
  }

  const idsNaEstante = useMemo(
    () => new Set(minhaEstante.map((livro) => livro.openLibraryId)),
    [minhaEstante],
  )

  return (
    <div className="home">
      <div className="home-topo">
        <div>
          <h1>Olá, {primeiroNome}</h1>
          <p>Veja como está a sua biblioteca hoje.</p>
        </div>

        <ResumoBiblioteca resumo={resumo} />
      </div>

      <CapasLeituras
        titulo="Lendo agora"
        vazio="Você não está lendo nada no momento."
        editavel={isAdmin}
        itens={itens("Lendo")}
      />

      <section className="secao">
        <h2>Minha estante</h2>

        {loading || carregandoEstante ? (
          <p className="carregando">Arrumando a estante…</p>
        ) : livros.length === 0 && minhaEstante.length === 0 ? (
          <div className="secao-vazia">
            <p>Nenhum livro por aqui ainda.</p>

            {isAdmin && (
              <Link
                to="/livros/novo"
                className={classeBotao("principal", "grande")}
              >
                <Icone nome="mais" /> Cadastrar livro
              </Link>
            )}
          </div>
        ) : (
          <>
            <Estante
              livros={livros}
              livrosPessoais={minhaEstante}
              lidos={lidos}
              lidosPessoais={lidosPessoais}
              editavel={isAdmin}
            />

            <p className="aviso">
              Cada lombada é um livro. Quanto mais alta, mais páginas, e as
              mais apagadas são as que você ainda não leu.
            </p>
          </>
        )}
      </section>

      <section className="secao">
        <h2>Adicionar livros à sua estante</h2>

        <p>
          Pesquise livros na Open Library e adicione-os à sua coleção pessoal.
        </p>

        <div className="livro-pesquisa">
          <form className="livro-pesquisa-controles" onSubmit={buscarLivros}>
            <input
              type="search"
              value={termo}
              onChange={(evento) => setTermo(evento.target.value)}
              placeholder="Digite o título ou autor..."
              aria-label="Pesquisar livros"
            />

            <Botao type="submit" variante="principal" disabled={pesquisando}>
              {pesquisando ? "Pesquisando..." : "Pesquisar"}
            </Botao>
          </form>

          {erro && (
            <p className="erro" role="alert">
              {erro}
            </p>
          )}

          {mensagem && (
            <p className="sucesso" role="status">
              {mensagem}
            </p>
          )}

          {resultados.length > 0 && (
            <ul className="livro-pesquisa-resultados">
              {resultados.map((livro) => {
                const jaAdicionado = idsNaEstante.has(livro.openLibraryId)

                return (
                  <li key={livro.openLibraryId}>
                    <button
                      type="button"
                      className="livro-pesquisa-selecao"
                      onClick={() => void adicionarLivro(livro)}
                      disabled={jaAdicionado || adicionando !== null}
                    >
                      {livro.capaUrl ? (
                        <img
                          className="livro-pesquisa-capa"
                          src={livro.capaUrl}
                          alt={`Capa de ${livro.titulo}`}
                        />
                      ) : (
                        <span className="livro-pesquisa-capa livro-pesquisa-sem-capa">
                          Sem capa
                        </span>
                      )}

                      <span className="livro-pesquisa-detalhes">
                        <strong>{livro.titulo}</strong>
                        <span>
                          {livro.autores.join(", ") || "Autor desconhecido"}
                        </span>
                        {livro.anoPublicacao && (
                          <span>{livro.anoPublicacao}</span>
                        )}
                        <span className="livro-pesquisa-acao">
                          {jaAdicionado
                            ? "Já está na sua estante"
                            : adicionando === livro.openLibraryId
                              ? "Adicionando..."
                              : "Adicionar à minha estante"}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      <CapasLeituras
        titulo="Na fila"
        vazio="Sua fila de leitura está vazia."
        editavel={isAdmin}
        itens={itens("Quero ler")}
      />
    </div>
  )
}
