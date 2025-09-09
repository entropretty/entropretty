import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/state"
import { cn } from "@/lib/utils"
import { useCallback, useEffect } from "react"

export const Controls = () => {
  const cycleMode = useApp((state) => state.cycleMode)
  const mode = useApp((state) => state.mode)
  const schema = useApp((state) => state.schema)
  const showControls = useApp((state) => state.showControls)
  const toggleControls = useApp((state) => state.toggleControls)
  const refreshSeeds = useApp((state) => state.refreshSeeds)
  const toggleDetails = useApp((state) => state.toggleDetails)

  const download = useCallback(() => {
    const canvas = document.getElementById("focus-canvas") as HTMLCanvasElement
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = (schema?.name || "entropretty") + ".png"
    link.click()
  }, [schema?.name])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "q") {
        cycleMode()
      }
      if (event.key === "w") {
        toggleControls()
      }
      if (event.key === "r") {
        location.reload()
      }
      if (event.key === "d") {
        toggleDetails()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [cycleMode, toggleControls, toggleDetails])

  if (!schema) return null

  return (
    <>
      <nav
        className={cn(
          "bg-background/95 supports-[backdrop-filter]:bg-background/30 fixed bottom-4 left-4 flex flex-row items-center justify-center overflow-hidden rounded-md border text-sm backdrop-blur transition-all duration-300 ease-in-out",
          { hidden: !showControls },
        )}
      >
        <div
          className={cn(
            "flex h-10 w-fit flex-row items-center justify-center rounded-r-md px-4",
            {
              "bg-yellow-400": schema.kind === "Procedural",
              "bg-blue-400": schema.kind === "ProceduralAccount",
              "bg-red-400": schema.kind === "ProceduralPersonal",
            },
          )}
        >
          {schema?.kind}
        </div>

        <div className="flex flex-row px-[2px]">
          <Button variant={"ghost"} className="w-36" onClick={cycleMode}>
            {`(q) ${mode}`}
          </Button>

          <Button variant={"ghost"} onClick={toggleControls}>
            (w) hide
          </Button>

          <Button variant={"ghost"}>(r) reload</Button>
          <Button variant={"ghost"} onMouseDown={toggleDetails}>
            (d) details
          </Button>
          <Button variant={"ghost"} onMouseDown={refreshSeeds}>
            new seeds
          </Button>

          <Button
            disabled={["families", "grid"].includes(mode)}
            variant={"ghost"}
            onMouseDown={download}
          >
            download
          </Button>
        </div>
      </nav>
      {!showControls && (
        <Button
          variant={"ghost"}
          onMouseDown={toggleControls}
          className="text-muted-foreground fixed bottom-4 left-4 h-10 text-sm"
        >
          show
        </Button>
      )}
    </>
  )
}
