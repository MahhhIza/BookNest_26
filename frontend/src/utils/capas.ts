export type CorDeCapa = { fundo: string; texto: string }

const CORES: CorDeCapa[] = [
  { fundo: "#264a31", texto: "#f4e9d6" },
  { fundo: "#5c2a22", texto: "#f4e9d6" },
  { fundo: "#8a6a3f", texto: "#fbf3e2" },
  { fundo: "#e3d6b8", texto: "#2b3a2c" },
  { fundo: "#3d5a3a", texto: "#f4e9d6" },
  { fundo: "#7b4b34", texto: "#f4e9d6" },
]

export const corDaCategoria = (categoriaId: number): CorDeCapa => CORES[categoriaId % CORES.length]
