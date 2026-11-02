import { Link } from "react-router-dom"
import { usePageTitle } from "@/hooks/usePageTitle"
import AuthLayout from "@/layouts/AuthLayout"
import RegisterForm from "./components/RegisterForm"

export default function Register() {
  usePageTitle("Criar conta")
  return (
    <AuthLayout
      title="Crie sua conta"
      description="Comece a organizar sua biblioteca digital."
      footer={
        <span>
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}
