import type { ReactNode } from "react"
import banner from "@/assets/auth-banner.webp"
import pattern from "@/assets/pattern.webp"
import Logo from "@/components/Logo"

type Props = { title: string; description: string; children: ReactNode; footer: ReactNode }

export default function AuthLayout({ title, description, children, footer }: Props) {
  return (
    <div className="auth">
      <aside className="auth-lateral" style={{ backgroundImage: `url(${banner})` }}>
        <Logo onDark altura={96} />
        <div className="auth-texto">
          <h2 className="auth-titulo">Um ninho tranquilo para os seus livros</h2>
          <p>Cadastre seus livros, acompanhe suas leituras e veja como a sua estante cresce.</p>
        </div>
        <small>© BookNest</small>
      </aside>

      <main className="auth-direito">
        <div className="auth-padrao" style={{ backgroundImage: `url(${pattern})`, backgroundSize: "560px" }} aria-hidden="true" />
        <div className="auth-caixa">
          <div className="auth-logo-mobile">
            <Logo altura={80} />
          </div>
          <section className="cartao">
            <div className="cartao-cabecalho">
              <h1 className="cartao-titulo">{title}</h1>
              <p className="cartao-descricao">{description}</p>
            </div>
            <div className="cartao-corpo">{children}</div>
            <div className="cartao-rodape">{footer}</div>
          </section>
        </div>
      </main>
    </div>
  )
}
