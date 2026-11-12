import { BaseCrudService } from "@/services/BaseCrudService"
import type { Categoria, CategoriaInput } from "@/types/categoria"

const NOMES = ["Romance", "Fantasia", "Ficção científica", "Suspense", "Terror", "Biografia", "História", "Autoajuda", "Poesia", "Infantil", "Técnico", "Quadrinhos"]
const seed: Categoria[] = NOMES.map((nome, i) => ({ id: i + 1, nome, descricao: `Livros de ${nome.toLowerCase()}.` }))

class CategoriaService extends BaseCrudService<Categoria, CategoriaInput> {
  protected readonly caminho = "/categorias"
  protected readonly dadosIniciais = seed

  protected override preparar(input: CategoriaInput): CategoriaInput {
    return { nome: input.nome.trim(), descricao: input.descricao.trim() }
  }
}

export const categoriaService = new CategoriaService()
