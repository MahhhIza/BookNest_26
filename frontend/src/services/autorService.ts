import { CrudService } from "@/services/crudService"
import type { Autor, AutorInput } from "@/types/autor"

const seed: Autor[] = [
  { id: 1, nome: "Machado de Assis", nacionalidade: "Brasileiro" },
  { id: 2, nome: "Clarice Lispector", nacionalidade: "Brasileira" },
  { id: 3, nome: "J. R. R. Tolkien", nacionalidade: "Britânico" },
  { id: 4, nome: "George Orwell", nacionalidade: "Britânico" },
  { id: 5, nome: "Isaac Asimov", nacionalidade: "Americano" },
  { id: 6, nome: "Agatha Christie", nacionalidade: "Britânica" },
  { id: 7, nome: "Carlos Drummond de Andrade", nacionalidade: "Brasileiro" },
  { id: 8, nome: "Antoine de Saint-Exupéry", nacionalidade: "Francês" },
  { id: 9, nome: "Robert C. Martin", nacionalidade: "Americano" },
  { id: 10, nome: "Stephen King", nacionalidade: "Americano" },
]

export const autorService = new CrudService<Autor, AutorInput>("/autores", seed)
