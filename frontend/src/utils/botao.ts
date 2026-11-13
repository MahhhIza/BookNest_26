export type VarianteBotao = "principal" | "contorno" | "perigo" | "fantasma" | "suave"
export type TamanhoBotao = "padrao" | "pequeno" | "grande" | "icone"

export function classeBotao(variante: VarianteBotao = "principal", tamanho: TamanhoBotao = "padrao") {
  return `botao botao-${variante} botao-${tamanho}`
}
