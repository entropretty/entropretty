import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { Dices } from "lucide-react"
import { generateNewSeedAtom } from "./atoms"

export function RerollBadge() {
  const [, generateNewSeed] = useAtom(generateNewSeedAtom)

  return (
    <Badge
      onClick={generateNewSeed}
      className={cn(
        "hover:bg-destructive text-destructive-foreground hover:text-destructive-foreground cursor-pointer select-none bg-transparent font-light text-black shadow-none",
        {},
      )}
    >
      <Dices className="mr-1 h-3 w-3" />
      REROLL SEED
    </Badge>
  )
}
