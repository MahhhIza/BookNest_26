import type { ComponentProps } from "react"
import { classeBotao, type TamanhoBotao, type VarianteBotao } from "@/utils/botao"

type Props = ComponentProps<"button"> & { variante?: VarianteBotao; tamanho?: TamanhoBotao }

export default function Botao({ variante, tamanho, className = "", type = "button", ...resto }: Props) {
  return <button type={type} className={`${classeBotao(variante, tamanho)} ${className}`.trim()} {...resto} />
}
