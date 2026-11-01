import { CrudService } from "@/services/crudService"
import type { Categoria, CategoriaInput } from "@/types/categoria"

const NOMES = ["Romance", "Fantasia", "Ficção científica", "Suspense", "Terror", "Biografia", "História", "Autoajuda", "Poesia", "Infantil", "Técnico", "Quadrinhos"]
const seed: Categoria[] = NOMES.map((nome, i) => ({ id: i + 1, nome, descricao: `Livros de ${nome.toLowerCase()}.` }))

export const categoriaService = new CrudService<Categoria, CategoriaInput>("/categorias", seed)
