import { BookPlus, Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function Home() {
  const { usuario } = useAuth()
  usePageTitle("Minha biblioteca")
  const primeiroNome = usuario?.nome.split(" ")[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-medium">Olá, {primeiroNome}</h1>
        <p className="mt-1 text-muted-foreground">Que bom ter você de volta à sua biblioteca.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
            <Library className="size-7" />
          </span>
          <div>
            <h2 className="font-heading text-xl font-medium">Sua estante ainda está vazia</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Quando você cadastrar seus livros, eles vão aparecer aqui.</p>
          </div>
          <Button disabled>
            <BookPlus /> Adicionar livro
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
