
import { useEffect, useState } from "react"
import CrudList from "@/components/CrudList"
import { useAllRecords } from "@/hooks/useAllRecords"
import { usePageTitle } from "@/hooks/usePageTitle"
import { autorService } from "@/services/autorService"
import { categoriaService } from "@/services/categoriaService"
import { livroService } from "@/services/livroService"
import { minhaEstanteService, type LivroMinhaEstante } from "@/services/minhaEstanteService"
import { useAuth } from "@/hooks/useAuth"
import GaleriaLivros from "./components/GaleriaLivros"

export default function Livros() {
  usePageTitle("Livros")
  const { isAdmin } = useAuth()
  const { byId: autores } = useAllRecords(autorService)
  const { byId: categorias } = useAllRecords(categoriaService)

  const [livrosPessoais, setLivrosPessoais] = useState<LivroMinhaEstante[]>([])
  const [carregandoEstante, setCarregandoEstante] = useState(true)
  const [erroEstante, setErroEstante] = useState("")

  useEffect(() => {
    let ativo = true

    async function carregarEstante() {
      try {
        const livros = await minhaEstanteService.listar()
        if (ativo) setLivrosPessoais(livros)
      } catch {
        if (ativo) setErroEstante("Não foi possível carregar sua estante pessoal.")
      } finally {
        if (ativo) setCarregandoEstante(false)
      }
    }

    carregarEstante()

    return () => {
      ativo = false
    }
  }, [])

  const conteudoPessoal = (
    <section className="secao-estante-pessoal" aria-labelledby="titulo-estante-pessoal">
      <h2 id="titulo-estante-pessoal">Minha Estante Pessoal</h2>
      <p className="texto-mudo">
        Livros adicionados por você através da Open Library.
      </p>

      {carregandoEstante ? (
        <p className="carregando">Carregando sua estante pessoal…</p>
      ) : erroEstante ? (
        <p className="aviso">{erroEstante}</p>
      ) : livrosPessoais.length === 0 ? (
        <p className="lista-vazia">
          Você ainda não adicionou livros à sua estante pessoal.
        </p>
      ) : (
        <ul className="galeria">
          {livrosPessoais.map((livro) => (
            <li key={livro.id}>
              {livro.capaUrl ? (
                <img
                  src={livro.capaUrl}
                  alt={`Capa de ${livro.titulo}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="capa capa-imagem"
                />
              ) : (
                <div className="capa capa-padrao">
                  <span className="capa-moldura" aria-hidden="true" />
                  <span className="capa-titulo">{livro.titulo}</span>
                  {livro.autores.length > 0 && (
                    <span className="capa-autor">{livro.autores.join(", ")}</span>
                  )}
                </div>
              )}

              <p className="galeria-info">
                {livro.autores.length > 0
                  ? livro.autores.join(", ")
                  : "Autor não informado"}
              </p>
              <p className="galeria-info">
                {livro.paginas ? `${livro.paginas} páginas` : "Páginas não informadas"}
                {livro.anoPublicacao ? ` · ${livro.anoPublicacao}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  return (
    <CrudList
      title="Livros"
      description="Consulte o catálogo compartilhado e os livros da sua estante pessoal."
      entityName="livro"
      basePath="/livros"
      newPath="/livros/novo"
      newLabel="Novo livro"
      emptyMessage="O catálogo compartilhado ainda está vazio."
      service={livroService}
      itemLabel={(l) => l.titulo}
      galeria={(rows) => (
        <GaleriaLivros livros={rows} autores={autores} editavel={isAdmin} />
      )}
      extraContent={conteudoPessoal}
      columns={[
        { header: "Título", cell: (l) => <span className="destaque">{l.titulo}</span> },
        { header: "Autor", cell: (l) => autores.get(l.autorId)?.nome ?? "—" },
        {
          header: "Categoria",
          cell: (l) => (
            <span className="texto-mudo">
              {categorias.get(l.categoriaId)?.nome ?? "—"}
            </span>
          ),
          hideOnMobile: true,
        },
        { header: "Páginas", cell: (l) => l.paginas, className: "col-direita", hideOnMobile: true },
        { header: "Ano", cell: (l) => l.ano, className: "col-direita", hideOnMobile: true },
      ]}
    />
  )
}
