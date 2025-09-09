import { DrawingBitmap } from "@/components/DrawingBitmap"
import { useApp } from "@/lib/state"
import { cn } from "@/lib/utils"
import type { SchemaMetadata } from "entropretty-utils"
import { seedToKey } from "entropretty-utils"
import { useMemo } from "react"
import { DrawingOverlay } from "./DrawingOverlay"
import { FamilyOverlay } from "./FamilyOverlay"

interface Props {
  schema: SchemaMetadata
}

function Exhibition({ schema }: Props) {
  const families = useApp((state) => state.seeds[schema.kind])
  const [familyIndex] = useApp((state) => [state.familyIndex])
  const mode = useApp((s) => s.mode)

  const [focusSize, gridSize] = useMemo(() => {
    const innerWidth = window.innerWidth || 1000
    const innerHeight = window.innerHeight || 1000

    const focus = {
      horizontal: innerWidth / 2,
      vertical: innerHeight / 2,
      grid: 0,
      single: innerHeight < innerWidth ? innerHeight : innerWidth,
      families: 0,
    }[mode]

    const grid = {
      horizontal: innerWidth / 8,
      vertical: innerHeight / 8,
      grid: innerHeight < innerWidth ? innerHeight / 4 : innerWidth / 4,
      single: 0,
      families: innerWidth / 16,
    }[mode]

    return [focus, grid]
  }, [mode])

  return (
    <div className="flex flex-col">
      {families &&
        mode === "families" &&
        families.map((family, f) => (
          <div key={family.toString()}>
            <div className="grid-cols-16 relative grid">
              {family.map((seed, index) => (
                <div
                  key={seedToKey(seed)}
                  className={"relative overflow-hidden"}
                >
                  <DrawingBitmap
                    schema={schema.name}
                    seed={seed}
                    size={gridSize}
                  />
                  <DrawingOverlay
                    familyIndex={f}
                    seedIndex={index}
                    seed={seed}
                  />
                </div>
              ))}
              <FamilyOverlay familyIndex={f} />
            </div>
          </div>
        ))}

      {families && mode !== "families" && (
        <div
          className={cn("flex items-start justify-start", {
            "flex-row": mode === "horizontal",
            "flex-col": mode === "vertical",
          })}
        >
          <FocusDrawing schema={schema} size={focusSize} />

          {mode !== "single" && (
            <div className="grid grid-cols-4">
              {families[familyIndex].map((seed, index) => (
                <div key={seedToKey(seed)} className="relative">
                  <DrawingBitmap
                    schema={schema.name}
                    seed={seed}
                    size={gridSize}
                  />
                  <DrawingOverlay
                    familyIndex={familyIndex}
                    seedIndex={index}
                    seed={seed}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FocusDrawing({
  schema,
  size,
}: {
  schema: SchemaMetadata
  size: number
}) {
  const families = useApp((state) => state.seeds[schema.kind])
  const [familyIndex, focusIndex] = useApp((state) => [
    state.familyIndex,
    state.focusIndex,
  ])

  return (
    <div className="relative overflow-hidden">
      <DrawingBitmap
        id="focus-canvas"
        schema={schema.name}
        seed={families[familyIndex][focusIndex]}
        size={size}
      />
      <DrawingOverlay
        familyIndex={familyIndex}
        seedIndex={focusIndex}
        seed={families[familyIndex][focusIndex]}
      />
    </div>
  )
}

export default Exhibition
