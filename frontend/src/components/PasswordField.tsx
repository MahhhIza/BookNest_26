import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import FormField, { type FormFieldProps } from "@/components/FormField"
import { Button } from "@/components/ui/button"

export default function PasswordField(props: Omit<FormFieldProps, "type" | "endAdornment">) {
  const [visible, setVisible] = useState(false)
  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      }
    />
  )
}
