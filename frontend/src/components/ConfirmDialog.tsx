import { useEffect, useRef } from "react"
import Botao from "@/components/Botao"
import Icone from "@/components/Icone"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
}

export default function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirmar", loading, onConfirm }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogo.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog ref={dialogo} className="modal" onClose={() => onOpenChange(false)} onClick={(ev) => ev.target === dialogo.current && onOpenChange(false)}>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="modal-acoes">
        <Botao variante="contorno" onClick={() => onOpenChange(false)} disabled={loading}>
          Cancelar
        </Botao>
        <Botao variante="perigo" onClick={onConfirm} disabled={loading}>
          {loading && <Icone nome="carregando" className="girando" />}
          {confirmLabel}
        </Botao>
      </div>
    </dialog>
  )
}
