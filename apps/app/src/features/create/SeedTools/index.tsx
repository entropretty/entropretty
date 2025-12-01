import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAtom, useSetAtom } from "jotai"
import { useCallback } from "react"
import {
  editorSeedFamilyAtom,
  editorSeedTypeAtom,
  formatOnSaveAtom,
  generateNewSeedAtom,
  SeedType,
} from "../atoms"
import { SeedManipulator } from "./SeedManipulator"
import { SeedRepresentation } from "./SeedRepresentation"

export const SeedTools = () => {
  const generateNewSeed = useSetAtom(generateNewSeedAtom)

  const [seedType, setSeedType] = useAtom(editorSeedTypeAtom)
  const [seedFamily] = useAtom(editorSeedFamilyAtom)
  const [formatOnSave, setFormatOnSave] = useAtom(formatOnSaveAtom)

  const handleSeedTypeChange = useCallback(
    (value: SeedType) => {
      setSeedType(value)
      generateNewSeed()
    },
    [generateNewSeed, setSeedType],
  )

  return (
    <div className="flex h-full w-full flex-col items-start gap-6 overflow-y-scroll p-4">
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-base">Seed Type</h2>

        <div className="flex flex-row items-center gap-2">
          <Select
            defaultValue="Procedural"
            onValueChange={handleSeedTypeChange}
            value={seedType}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Procedural">Entropy</SelectItem>
              <SelectItem value="ProceduralPersonal">Personal Id</SelectItem>
              <SelectItem value="ProceduralAccount">Account Id</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={generateNewSeed}>
            REROLL
          </Button>
        </div>

        <div className="flex w-full flex-col gap-4 pt-2">
          <div>
            <h3 className="text-base">Current Seed</h3>
            <p className="text-muted-foreground text-xs">
              This is the value of your main seed. The other shown seeds are
              slightly mutated versions of this one.
            </p>
          </div>

          <SeedRepresentation seed={seedFamily[0]} />
        </div>

        <div className="flex w-full flex-col gap-4 pt-2">
          <div>
            <h3 className="text-base">Manipulation</h3>
            <p className="text-muted-foreground text-xs">
              Fine-tune and adjust your current seed values manually.
            </p>
          </div>
          <SeedManipulator />
        </div>
      </div>

      <Separator />

      <div className="flex w-full flex-col gap-4">
        <h2 className="text-lg">Editor</h2>

        <div className="flex flex-row items-center gap-2">
          <Checkbox
            id="format-on-save"
            checked={formatOnSave}
            onCheckedChange={(checked) => setFormatOnSave(checked === true)}
          />
          <label
            htmlFor="format-on-save"
            className="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Format code on save (Cmd+S)
          </label>
        </div>
      </div>
    </div>
  )
}
