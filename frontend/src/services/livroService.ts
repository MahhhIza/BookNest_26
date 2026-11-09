import { CrudService } from "@/services/crudService"
import type { Livro, LivroInput } from "@/types/livro"

const seed: Livro[] = [
  { id: 1, titulo: "Dom Casmurro", autorId: 1, categoriaId: 1, paginas: 256, ano: 1899 },
  { id: 2, titulo: "A Hora da Estrela", autorId: 2, categoriaId: 1, paginas: 88, ano: 1977 },
  { id: 3, titulo: "A Sociedade do Anel", autorId: 3, categoriaId: 2, paginas: 576, ano: 1954 },
  { id: 4, titulo: "O Hobbit", autorId: 3, categoriaId: 2, paginas: 336, ano: 1937 },
  { id: 5, titulo: "1984", autorId: 4, categoriaId: 3, paginas: 416, ano: 1949 },
  { id: 6, titulo: "A Revolução dos Bichos", autorId: 4, categoriaId: 3, paginas: 152, ano: 1945 },
  { id: 7, titulo: "Fundação", autorId: 5, categoriaId: 3, paginas: 255, ano: 1951 },
  { id: 8, titulo: "Eu, Robô", autorId: 5, categoriaId: 3, paginas: 320, ano: 1950 },
  { id: 9, titulo: "Assassinato no Expresso do Oriente", autorId: 6, categoriaId: 4, paginas: 256, ano: 1934 },
  { id: 10, titulo: "O Caso dos Dez Negrinhos", autorId: 6, categoriaId: 4, paginas: 264, ano: 1939 },
  { id: 11, titulo: "A Rosa do Povo", autorId: 7, categoriaId: 9, paginas: 128, ano: 1945 },
  { id: 12, titulo: "O Pequeno Príncipe", autorId: 8, categoriaId: 10, paginas: 96, ano: 1943 },
  { id: 13, titulo: "Código Limpo", autorId: 9, categoriaId: 11, paginas: 425, ano: 2008 },
  { id: 14, titulo: "It: A Coisa", autorId: 10, categoriaId: 5, paginas: 1104, ano: 1986 },
  { id: 15, titulo: "O Iluminado", autorId: 10, categoriaId: 5, paginas: 447, ano: 1977 },
  { id: 16, titulo: "Memórias Póstumas de Brás Cubas", autorId: 1, categoriaId: 1, paginas: 368, ano: 1881 },
]

export const livroService = new CrudService<Livro, LivroInput>("/livros", seed)
