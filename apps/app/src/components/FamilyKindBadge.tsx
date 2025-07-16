import { FamilyKind } from "entropretty-utils"
import { cn, familyKindLabel } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface FamilyKindBadgeProps {
  familyKind: FamilyKind | null
  className?: string
}

export function FamilyKindBadge({
  familyKind,
  className,
}: FamilyKindBadgeProps) {
  if (!familyKind) return null

  return (
    <Badge className={cn(className)} variant={familyKind}>
      {familyKindLabel(familyKind)}
    </Badge>
  )
}
