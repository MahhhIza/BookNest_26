import { useState } from "react"
import Botao from "@/components/Botao"
import FormField, { type FormFieldProps } from "@/components/FormField"
import Icone from "@/components/Icone"

export default function PasswordField(props: Omit<FormFieldProps, "type" | "endAdornment">) {
  const [visible, setVisible] = useState(false)
  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <Botao variante="fantasma" tamanho="icone" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Ocultar senha" : "Mostrar senha"}>
          <Icone nome={visible ? "olhoRiscado" : "olho"} />
        </Botao>
      }
    />
  )
}
