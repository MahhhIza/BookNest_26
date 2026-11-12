import { Link } from "react-router-dom"
import Botao from "@/components/Botao"
import Icone from "@/components/Icone"
import { classeBotao } from "@/utils/botao"

type Props = { cancelTo: string; saving: boolean; submitLabel: string }

export default function FormActions({ cancelTo, saving, submitLabel }: Props) {
  return (
    <div className="formulario-acoes">
      <Link to={cancelTo} className={classeBotao("contorno", "grande")}>
        Cancelar
      </Link>
      <Botao type="submit" tamanho="grande" disabled={saving}>
        {saving && <Icone nome="carregando" className="girando" />}
        {saving ? "Salvando…" : submitLabel}
      </Botao>
    </div>
  )
}
