import type { ReactNode } from "react"
import banner from "@/assets/auth-banner.webp"
import pattern from "@/assets/pattern.webp"
import Logo from "@/components/Logo"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Props = { title: string; description: string; children: ReactNode; footer: ReactNode }

export default function AuthLayout({ title, description, children, footer }: Props) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <aside
        className="hidden flex-col justify-start gap-10 bg-[#1e311d] bg-cover bg-[position:75%_center] p-12 text-primary-foreground lg:flex"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <Logo onDark className="h-24 w-auto self-start" />
        <div className="max-w-[16rem] space-y-4">
          <h2 className="font-heading text-4xl leading-tight font-medium">Um ninho tranquilo para os seus livros</h2>
          <p className="text-primary-foreground/80">Cadastre seus livros, acompanhe suas leituras e veja como a sua estante cresce.</p>
        </div>
        <small className="mt-auto text-primary-foreground/60">© BookNest</small>
      </aside>

      <main className="relative flex items-center justify-center px-4 py-10">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${pattern})`, backgroundSize: "560px" }} aria-hidden="true" />
        <div className="relative w-full max-w-md">
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
