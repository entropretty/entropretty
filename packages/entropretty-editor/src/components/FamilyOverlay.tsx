import { useApp } from "@/lib/state"
import { cn } from "@/lib/utils"

interface Props {
  familyIndex: number
}

export const FamilyOverlay: React.FC<Props> = ({ familyIndex }) => {
  const [currentFamily] = useApp((stat) => [stat.familyIndex])
  const schema = useApp((state) => state.schema)
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute h-full w-full rounded-md border",
          {
            "opacity-0": familyIndex !== currentFamily,
            "border-yellow-400": schema?.kind === "Procedural",
            "border-blue-400": schema?.kind === "ProceduralAccount",
            "border-red-400": schema?.kind === "ProceduralPersonal",
          },
        )}
      />
    </>
  )
}
