import dark from "@/assets/booklogo-dark.png"
import light from "@/assets/booklogo-light.png"

type Props = { onDark?: boolean; altura?: number }

export default function Logo({ onDark = false, altura = 96 }: Props) {
  return <img src={onDark ? light : dark} alt="BookNest" style={{ height: altura, width: "auto" }} />
}
