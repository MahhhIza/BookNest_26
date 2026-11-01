import { Link, useLocation } from "react-router-dom"
import FormAlert from "@/components/FormAlert"
import { usePageTitle } from "@/hooks/usePageTitle"
import AuthLayout from "@/layouts/AuthLayout"
import LoginForm from "./components/LoginForm"

export default function Login() {
  usePageTitle("Entrar")
  const { state } = useLocation() as { state: { cadastrado?: boolean } | null }
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      description="Entre para acessar sua biblioteca."
      footer={
        <span>
          Não tem conta?{" "}
          <Link to="/cadastro" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </span>
      }
    >
      {state?.cadastrado && <FormAlert variant="success">Cadastro realizado com sucesso! Faça login para continuar.</FormAlert>}
      <LoginForm />
    </AuthLayout>
  )
}
