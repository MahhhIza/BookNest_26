import { useState } from "react"
import { corDaCategoria } from "@/utils/capas"

type Props = { titulo: string; autor?: string; categoriaId: number; capaUrl?: string | null }

export default function CapaLivro({ titulo, autor, categoriaId, capaUrl }: Props) {
  const [urlComErro, setUrlComErro] = useState<string | null>(null)
  const cor = corDaCategoria(categoriaId)

  if (capaUrl && capaUrl !== urlComErro) {
    return <img src={capaUrl} alt={`Capa de ${titulo}`} loading="lazy" referrerPolicy="no-referrer" onError={() => setUrlComErro(capaUrl)} className="capa capa-imagem" />
  }

  return (
    <div className="capa capa-padrao" style={{ backgroundColor: cor.fundo, color: cor.texto }}>
      <span className="capa-moldura" aria-hidden="true" />
      <span className="capa-titulo">{titulo}</span>
      {autor && <span className="capa-autor">{autor}</span>}
    </div>
  )
}
