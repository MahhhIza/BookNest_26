import { useState } from "react"
import { corDaCategoria } from "@/utils/capas"

type Props = { titulo: string; autor?: string; categoriaId: number; capaUrl?: string | null; className?: string }

export default function CapaLivro({ titulo, autor, categoriaId, capaUrl, className = "" }: Props) {
  const [urlComErro, setUrlComErro] = useState<string | null>(null)
  const cor = corDaCategoria(categoriaId)

  if (capaUrl && capaUrl !== urlComErro) {
    return (
      <img
        src={capaUrl}
        alt={`Capa de ${titulo}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setUrlComErro(capaUrl)}
        className={`aspect-[2/3] w-full rounded-sm object-cover shadow-sm ${className}`}
      />
    )
  }

  return (
    <div className={`relative flex aspect-[2/3] flex-col justify-between rounded-sm p-4 shadow-sm ${className}`} style={{ backgroundColor: cor.fundo, color: cor.texto }}>
      <span className="pointer-events-none absolute inset-1.5 rounded-[2px] border border-current opacity-30" aria-hidden="true" />
      <span className="relative text-sm leading-snug font-semibold">{titulo}</span>
      {autor && <span className="relative text-xs opacity-80">{autor}</span>}
    </div>
  )
}
