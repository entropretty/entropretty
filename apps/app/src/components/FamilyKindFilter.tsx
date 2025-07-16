import { familyKindFilterAtom } from "@/atoms/family-kind-filter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, familyKindColor } from "@/lib/utils"
import { FamilyKind } from "entropretty-utils"
import { useAtom } from "jotai"

interface FamilyKindFilterProps {
  className?: string
}

export function FamilyKindFilter({ className }: FamilyKindFilterProps) {
  const [value, setValue] = useAtom(familyKindFilterAtom)

  const handleValueChange = (newValue: string) => {
    setValue(newValue as FamilyKind | "All")
  }

  return (
    <div className={cn("w-[200px]", className)}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger
          className={cn(
            "font-jersey text-lg hover:cursor-pointer",
            value !== "All" && familyKindColor(value as FamilyKind),
            value === "Procedural"
              ? "text-primary-foreground"
              : value !== "All"
                ? "text-primary-background"
                : "",
          )}
        >
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="All"
            className="font-jersey bg-transparent text-lg hover:cursor-pointer"
          >
            Show All
          </SelectItem>
          <SelectItem
            value="Procedural"
            className={cn(
              familyKindColor("Procedural"),
              "text-primary-foreground font-jersey text-lg hover:cursor-pointer",
            )}
          >
            Entropy
          </SelectItem>
          <SelectItem
            value="ProceduralPersonal"
            className={cn(
              familyKindColor("ProceduralPersonal"),
              "text-primary-background",
              "font-jersey text-lg",
              "hover:cursor-pointer",
            )}
          >
            Personal Id
          </SelectItem>
          <SelectItem
            value="ProceduralAccount"
            className={cn(
              familyKindColor("ProceduralAccount"),
              "text-primary-background",
              "font-jersey text-lg",
              "hover:cursor-pointer",
            )}
          >
            Account Id
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
