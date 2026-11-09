import CrudFormPage from "@/components/CrudFormPage"
import { leituraService } from "@/services/leituraService"
import type { Leitura, LeituraInput } from "@/types/leitura"
import LeituraForm from "./components/LeituraForm"

const toInput = (l: Leitura): LeituraInput => ({ livroId: l.livroId, status: l.status, nota: l.nota, concluidaEm: l.concluidaEm })

export default function LeituraFormPage() {
  return (
    <CrudFormPage service={leituraService} listPath="/leituras" entityName="leitura" feminino toInput={toInput}>
      {(props) => <LeituraForm {...props} />}
    </CrudFormPage>
  )
}
