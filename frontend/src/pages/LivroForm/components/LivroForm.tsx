
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router-dom"
import Botao from "@/components/Botao"
import FormActions from "@/components/FormActions"
import FormField from "@/components/FormField"
import SelectField from "@/components/SelectField"
import { useAllRecords } from "@/hooks/useAllRecords"
import { autorService } from "@/services/autorService"
import { categoriaService } from "@/services/categoriaService"
import { ApiError } from "@/services/api"
import {
  pesquisarLivros,
  type LivroEncontrado,
} from "@/services/openLibraryService"
import type { CrudFormProps } from "@/types/form"
import type { LivroInput } from "@/types/livro"
import { isHttpUrl } from "@/utils/validators"

type Values = {
  titulo: string
  autorId: string
  categoriaId: string
  paginas: string
  ano: string
  capaUrl: string
}

type Errors = Partial<Record<keyof LivroInput, string>>

const toValues = (l?: LivroInput): Values => ({
  titulo: l?.titulo ?? "",
  autorId: l ? String(l.autorId) : "",
  categoriaId: l ? String(l.categoriaId) : "",
  paginas: l ? String(l.paginas) : "",
  ano: l ? String(l.ano) : "",
  capaUrl: l?.capaUrl ?? "",
})

function validate(v: Values): Errors {
  const e: Errors = {}
  const paginas = Number(v.paginas)
  const ano = Number(v.ano)

  if (v.titulo.trim().length < 2) {
    e.titulo = "Informe o título do livro."
  }

  if (!v.autorId) {
    e.autorId = "Escolha o autor."
  }

  if (!v.categoriaId) {
    e.categoriaId = "Escolha a categoria."
  }

  if (!Number.isInteger(paginas) || paginas < 1) {
    e.paginas = "Informe o número de páginas."
  }

  if (!Number.isInteger(ano) || ano < 1 || ano > new Date().getFullYear()) {
    e.ano = "Informe um ano válido."
  }

  const capa = v.capaUrl.trim()

  if (capa && (capa.length > 500 || !isHttpUrl(capa))) {
    e.capaUrl =
      "Informe um link válido, começando com http:// ou https://."
  }

  return e
}

function normalizarNome(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR")
}

export default function LivroForm({
  initial,
  saving,
  fieldErrors = {},
  submitLabel,
  onSubmit,
}: CrudFormProps<LivroInput>) {
  const [values, setValues] = useState<Values>(toValues(initial))
  const [errors, setErrors] = useState<Errors>({})
  const [termo, setTermo] = useState("")
  const [resultados, setResultados] = useState<LivroEncontrado[]>([])
  const [livroSelecionado, setLivroSelecionado] =
    useState<LivroEncontrado | null>(null)
  const [pesquisando, setPesquisando] = useState(false)
  const [erroPesquisa, setErroPesquisa] = useState("")
  const [avisoAutor, setAvisoAutor] = useState("")
  const [avisoCategoria, setAvisoCategoria] = useState("")

  const { records: autores } = useAllRecords(autorService)
  const { records: categorias } = useAllRecords(categoriaService)

  const set = (field: keyof Values) =>
    (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: ev.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))

      if (field === "autorId") {
        setAvisoAutor("")
      }

      if (field === "categoriaId") {
        setAvisoCategoria("")
      }
    }

  async function handlePesquisa() {
    if (termo.trim().length < 2) {
      setErroPesquisa("Digite pelo menos dois caracteres.")
      setResultados([])
      setLivroSelecionado(null)
      return
    }

    setPesquisando(true)
    setErroPesquisa("")
    setResultados([])
    setLivroSelecionado(null)
    setAvisoAutor("")
    setAvisoCategoria("")

    try {
      const resposta = await pesquisarLivros(termo, 5)
      setResultados(resposta.resultados)

      if (resposta.resultados.length === 0) {
        setErroPesquisa("Nenhum livro encontrado. Tente outro termo.")
      }
    } catch (erro) {
      setErroPesquisa(
        erro instanceof ApiError
          ? erro.message
          : "Não foi possível pesquisar livros agora."
      )
    } finally {
      setPesquisando(false)
    }
  }

  function selecionarLivro(livro: LivroEncontrado) {
    const autoresEncontrados = livro.autores.map(normalizarNome)
    const assuntosEncontrados = livro.assuntos.map(normalizarNome)

    const autorCorrespondente = autores.find((autor) =>
      autoresEncontrados.includes(normalizarNome(autor.nome))
    )

    const categoriaCorrespondente = categorias.find((categoria) =>
      assuntosEncontrados.includes(normalizarNome(categoria.nome))
    )

    setValues((prev) => ({
      ...prev,
      titulo: livro.titulo,
      autorId: autorCorrespondente ? String(autorCorrespondente.id) : "",
      categoriaId: categoriaCorrespondente
        ? String(categoriaCorrespondente.id)
        : "",
      paginas: livro.paginas !== null ? String(livro.paginas) : "",
      ano: livro.anoPublicacao !== null
        ? String(livro.anoPublicacao)
        : "",
      capaUrl: livro.capaUrl ?? "",
    }))

    setErrors((prev) => ({
      ...prev,
      titulo: undefined,
      autorId: undefined,
      categoriaId: undefined,
      paginas: undefined,
      ano: undefined,
      capaUrl: undefined,
    }))

    setLivroSelecionado(livro)

    setAvisoAutor(
      autorCorrespondente
        ? ""
        : livro.autores.length > 0
          ? `Não encontramos "${livro.autores[0]}" no cadastro. Escolha um autor existente ou cadastre-o.`
          : "A pesquisa não informou o autor. Escolha um autor cadastrado."
    )

    setAvisoCategoria(
      categoriaCorrespondente
        ? ""
        : livro.assuntos.length > 0
          ? "Não encontramos uma categoria cadastrada correspondente aos assuntos deste livro. Escolha uma categoria existente ou cadastre uma nova."
          : "A pesquisa não informou os assuntos deste livro. Escolha uma categoria cadastrada."
    )
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()

    const found = validate(values)
    setErrors(found)

    if (Object.keys(found).length) return

    onSubmit({
      titulo: values.titulo.trim(),
      autorId: Number(values.autorId),
      categoriaId: Number(values.categoriaId),
      paginas: Number(values.paginas),
      ano: Number(values.ano),
      capaUrl: values.capaUrl.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="formulario">
      <section className="livro-pesquisa" aria-label="Pesquisa de livros">
        <div>
          <h3>Buscar na Open Library</h3>
          <p className="campo-dica">
            Encontre um livro e aproveite os dados disponíveis para preencher
            o formulário.
          </p>
        </div>

        <div className="livro-pesquisa-controles">
          <FormField
            label="Título ou termo de pesquisa"
            name="pesquisaOpenLibrary"
            value={termo}
            onChange={(ev) => setTermo(ev.target.value)}
            placeholder="Ex.: Harry Potter"
          />

          <Botao
            type="button"
            tamanho="grande"
            disabled={pesquisando}
            onClick={() => void handlePesquisa()}
          >
            {pesquisando ? "Pesquisando..." : "Pesquisar"}
          </Botao>
        </div>

        {erroPesquisa && (
          <p className="campo-erro" role="status">
            {erroPesquisa}
          </p>
        )}

        {livroSelecionado && (
          <div>
            <p className="campo-dica">
              <strong>Livro selecionado:</strong> os dados disponíveis foram
              preenchidos no formulário.
            </p>

            <ul className="livro-pesquisa-resultados">
              <li>
                <div className="livro-pesquisa-selecao">
                  {livroSelecionado.capaUrl ? (
                    <img
                      src={livroSelecionado.capaUrl}
                      alt={`Capa de ${livroSelecionado.titulo}`}
                      className="livro-pesquisa-capa"
                    />
                  ) : (
                    <span className="livro-pesquisa-capa livro-pesquisa-sem-capa">
                      Sem capa
                    </span>
                  )}

                  <span className="livro-pesquisa-detalhes">
                    <strong>{livroSelecionado.titulo}</strong>
                    <span>
                      {livroSelecionado.autores.join(", ") ||
                        "Autor não informado"}
                    </span>
                    <span>
                      {livroSelecionado.anoPublicacao ?? "Ano não informado"}
                      {" · "}
                      {livroSelecionado.paginas
                        ? `${livroSelecionado.paginas} páginas`
                        : "Páginas não informadas"}
                    </span>
                  </span>
                </div>
              </li>
            </ul>

            <Botao
              type="button"
              variante="contorno"
              tamanho="pequeno"
              onClick={() => setLivroSelecionado(null)}
            >
              Escolher outro resultado
            </Botao>
          </div>
        )}

        {resultados.length > 0 && !livroSelecionado && (
          <div>
            <p className="campo-dica">
              {resultados.length} resultado(s). Selecione um para preencher
              os campos.
            </p>

            <ul className="livro-pesquisa-resultados">
              {resultados.map((livro) => (
                <li key={livro.openLibraryId}>
                  <button
                    type="button"
                    className="livro-pesquisa-selecao"
                    onClick={() => selecionarLivro(livro)}
                  >
                    {livro.capaUrl ? (
                      <img
                        src={livro.capaUrl}
                        alt={`Capa de ${livro.titulo}`}
                        className="livro-pesquisa-capa"
                      />
                    ) : (
                      <span className="livro-pesquisa-capa livro-pesquisa-sem-capa">
                        Sem capa
                      </span>
                    )}

                    <span className="livro-pesquisa-detalhes">
                      <strong>{livro.titulo}</strong>

                      <span>
                        {livro.autores.join(", ") || "Autor não informado"}
                      </span>

                      <span>
                        {livro.anoPublicacao ?? "Ano não informado"}
                        {" · "}
                        {livro.paginas
                          ? `${livro.paginas} páginas`
                          : "Páginas não informadas"}
                      </span>

                      <span className="livro-pesquisa-acao">
                        Selecionar livro
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <FormField
        label="Título"
        name="titulo"
        value={values.titulo}
        onChange={set("titulo")}
        error={errors.titulo ?? fieldErrors.titulo}
      />

      <SelectField
        label="Autor"
        name="autorId"
        placeholder="Escolha o autor"
        value={values.autorId}
        onChange={set("autorId")}
        options={autores.map((a) => ({ value: a.id, label: a.nome }))}
        error={errors.autorId ?? fieldErrors.autorId}
      />

      {avisoAutor && (
        <div className="livro-pesquisa-aviso" role="status">
          <p>{avisoAutor}</p>
          <Link to="/autores/novo" target="_blank" rel="noreferrer">
            Cadastrar autor em outra aba
          </Link>
        </div>
      )}

      <SelectField
        label="Categoria"
        name="categoriaId"
        placeholder="Escolha a categoria"
        value={values.categoriaId}
        onChange={set("categoriaId")}
        options={categorias.map((c) => ({ value: c.id, label: c.nome }))}
        error={errors.categoriaId ?? fieldErrors.categoriaId}
      />

      {avisoCategoria && (
        <div className="livro-pesquisa-aviso" role="status">
          <p>{avisoCategoria}</p>
          <Link to="/categorias/nova" target="_blank" rel="noreferrer">
            Cadastrar categoria em outra aba
          </Link>
        </div>
      )}

      <div className="formulario-duas">
        <FormField
          label="Páginas"
          name="paginas"
          type="number"
          min={1}
          value={values.paginas}
          onChange={set("paginas")}
          error={errors.paginas ?? fieldErrors.paginas}
        />

        <FormField
          label="Ano de publicação"
          name="ano"
          type="number"
          value={values.ano}
          onChange={set("ano")}
          error={errors.ano ?? fieldErrors.ano}
        />
      </div>

      <FormField
        label="Link da capa (opcional)"
        name="capaUrl"
        type="url"
        placeholder="https://"
        value={values.capaUrl}
        onChange={set("capaUrl")}
        error={errors.capaUrl ?? fieldErrors.capaUrl}
        hint="Se ficar vazio, o BookNest desenha uma capa pelo título."
      />

      <FormActions
        cancelTo="/livros"
        saving={saving}
        submitLabel={submitLabel}
      />
    </form>
  )
}
