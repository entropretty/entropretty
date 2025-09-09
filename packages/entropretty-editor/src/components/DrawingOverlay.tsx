import { useApp } from "@/lib/state"
import { cn } from "@/lib/utils"
import { Seed } from "entropretty-utils"
import { useCallback } from "react"

interface Props {
  seed: Seed
  familyIndex: number
  seedIndex: number
}

export const DrawingOverlay: React.FC<Props> = ({
  familyIndex,
  seedIndex,
  seed,
}) => {
  const [currentFamily, currentFocus] = useApp((stat) => [
    stat.familyIndex,
    stat.focusIndex,
  ])
  const schema = useApp((state) => state.schema)
  const setFocus = useApp((state) => state.setFocus)
  const showDetails = useApp((state) => state.showDetails)
  const focus = useCallback(() => {
    setFocus(familyIndex, seedIndex)
  }, [familyIndex, seedIndex, setFocus])

  return (
    <>
      {showDetails && (
        <div className="bg-background/50 absolute bottom-0 left-0 flex h-full w-full whitespace-normal border text-[9px]">
          [{seed.join(", ")}]
        </div>
      )}

      {showDetails && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          ×
        </div>
      )}

      <div
        title={seed.join(",")}
        className={cn(
          "absolute bottom-0 h-full w-full cursor-pointer border-b-4",
          {
            "opacity-0":
              familyIndex !== currentFamily || seedIndex !== currentFocus,
            "border-b-yellow-400": schema?.kind === "Procedural",
            "border-b-blue-400": schema?.kind === "ProceduralAccount",
            "border-b-red-400": schema?.kind === "ProceduralPersonal",
          },
        )}
        onClick={focus}
      ></div>
    </>
  )
}
