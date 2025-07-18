import { FamilyKind } from "entropretty-utils"
import { cn, familyKindLabel } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "../contexts/theme-context"

interface FamilyKindBadgeProps {
  familyKind: FamilyKind | null
  className?: string
}

export function FamilyKindBadge({
  familyKind,
  className,
}: FamilyKindBadgeProps) {
  const { theme } = useTheme()
  if (!familyKind) return null

  return (
    <Badge
      className={cn(className, {
        "text-background": theme === "dark",
        "text-foreground": theme === "dark" && familyKind === "Procedural",
      })}
      variant={familyKind}
    >
      {familyKindLabel(familyKind)}
    </Badge>
  )
}
