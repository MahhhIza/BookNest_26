export interface Livro {
  id: number
  titulo: string
  autorId: number
  categoriaId: number
  paginas: number
  ano: number
  capaUrl?: string | null
}
export type LivroInput = Omit<Livro, "id">
