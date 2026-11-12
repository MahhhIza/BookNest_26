import { BaseCrudService } from "@/services/BaseCrudService"
import type { Leitura, LeituraInput } from "@/types/leitura"

const seed: Leitura[] = [
  { id: 1, livroId: 1, status: "Lido", nota: 5, concluidaEm: "2026-01-18" },
  { id: 2, livroId: 2, status: "Lido", nota: 4, concluidaEm: "2026-02-09" },
  { id: 3, livroId: 4, status: "Lido", nota: 5, concluidaEm: "2026-03-14" },
  { id: 4, livroId: 5, status: "Lido", nota: 5, concluidaEm: "2026-04-02" },
  { id: 5, livroId: 6, status: "Lido", nota: 4, concluidaEm: "2026-04-20" },
  { id: 6, livroId: 7, status: "Lido", nota: 4, concluidaEm: "2026-05-17" },
  { id: 7, livroId: 9, status: "Lido", nota: 3, concluidaEm: "2026-06-08" },
  { id: 8, livroId: 12, status: "Lido", nota: 5, concluidaEm: "2026-06-25" },
  { id: 9, livroId: 8, status: "Lido", nota: 4, concluidaEm: "2026-07-11" },
  { id: 10, livroId: 13, status: "Lido", nota: 3, concluidaEm: "2026-08-05" },
  { id: 11, livroId: 15, status: "Lido", nota: 4, concluidaEm: "2026-09-13" },
  { id: 12, livroId: 11, status: "Lido", nota: 4, concluidaEm: "2026-10-04" },
  { id: 13, livroId: 16, status: "Lido", nota: 5, concluidaEm: "2026-10-22" },
  { id: 14, livroId: 3, status: "Lendo", nota: null, concluidaEm: null },
  { id: 15, livroId: 14, status: "Quero ler", nota: null, concluidaEm: null },
]

class LeituraService extends BaseCrudService<Leitura, LeituraInput> {
  protected readonly caminho = "/leituras"
  protected readonly dadosIniciais = seed

  protected override preparar(input: LeituraInput): LeituraInput {
    if (input.status === "Lido") return input
    return { ...input, nota: null, concluidaEm: null }
  }
}

export const leituraService = new LeituraService()
