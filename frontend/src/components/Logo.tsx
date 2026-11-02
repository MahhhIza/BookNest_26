import dark from "@/assets/booklogo-dark.png"
import light from "@/assets/booklogo-light.png"

type Props = { onDark?: boolean; className?: string }

export default function Logo({ onDark = false, className }: Props) {
  return <img src={onDark ? light : dark} alt="BookNest" className={className ?? "h-24 w-auto"} />
}
