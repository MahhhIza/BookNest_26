import Botao from "@/components/Botao"
import Icone from "@/components/Icone"

type Props = { page: number; totalPages: number; onPageChange: (page: number) => void }

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav className="paginacao" aria-label="Paginação">
      <Botao variante="contorno" tamanho="pequeno" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <Icone nome="esquerda" /> Anterior
      </Botao>
      <span>
        Página {page} de {totalPages}
      </span>
      <Botao variante="contorno" tamanho="pequeno" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Próxima <Icone nome="direita" />
      </Botao>
    </nav>
  )
}
