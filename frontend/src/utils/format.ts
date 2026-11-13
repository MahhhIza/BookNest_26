export function formatarData(iso: string | null): string {
  if (!iso) return "—"
  const [ano, mes, dia] = iso.split("-")
  return `${dia}/${mes}/${ano}`
}
