import { BookMarked, BookOpen, Library } from "lucide-react"
import type { ReactNode } from "react"
import Logo from "@/components/Logo"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Props = { title: string; description: string; children: ReactNode; footer: ReactNode }

const HIGHLIGHTS = [
  { icon: Library, text: "Todos os seus livros em um só lugar" },
  { icon: BookOpen, text: "Acompanhe o que você está lendo" },
  { icon: BookMarked, text: "Guarde o que já leu e o que quer ler" },
]

export default function AuthLayout({ title, description, children, footer }: Props) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-linear-to-br from-[#8a5a37] via-[#5e3a20] to-[#3d2413] p-12 text-white lg:flex">
        <Logo onDark className="h-28 w-auto self-start" />
        <div className="space-y-8">
          <h2 className="max-w-sm font-heading text-4xl leading-tight font-medium">Um ninho tranquilo para os seus livros</h2>
          <ul className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/85">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <small className="text-white/50">© BookNest</small>
      </aside>

      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo className="h-20 w-auto" />
          </div>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
            <CardFooter className="justify-center text-sm text-muted-foreground">{footer}</CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
