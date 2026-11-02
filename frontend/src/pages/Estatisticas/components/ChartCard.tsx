import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Props = { title: string; description: string; children: ReactNode }

export default function ChartCard({ title, description, children }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  )
}
