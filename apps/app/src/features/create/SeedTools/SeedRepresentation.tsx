import { editorSeedTypeAtom } from "@/features/create/atoms"
import { numeric } from "entropretty-utils"
import { useAtomValue } from "jotai"

interface SeedRepresentationProps {
  seed: number[]
}

export const SeedRepresentation = ({ seed }: SeedRepresentationProps) => {
  const seedType = useAtomValue(editorSeedTypeAtom)

  const numericValue = numeric(new Uint8Array(seed)).toString()
  const hexValues = seed
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col gap-2">
      {seedType === "ProceduralAccount" && (
        <div className="font-mono text-sm">{"0x" + hexValues}</div>
      )}
      {seedType === "ProceduralPersonal" && (
        <div className="font-mono text-sm">{numericValue}</div>
      )}
      {/* <Input disabled type="text" value={seedToKey(seed)} /> */}
      <div className="text-muted-foreground break-all font-mono text-xs">
        [{seed.join(",")}]
      </div>
    </div>
  )
}
