export type Autor = { id: number; nome: string; nacionalidade: string }
export type AutorInput = Omit<Autor, "id">
