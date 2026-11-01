import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePageTitle } from "@/hooks/usePageTitle"
import ProfileForm from "./components/ProfileForm"

export default function Profile() {
  usePageTitle("Meu perfil")
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Meu perfil</CardTitle>
        <CardDescription>Atualize seus dados pessoais.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm />
      </CardContent>
    </Card>
  )
}
