import { AlgorithmView } from "@/lib/helper.types"
import { FamilyKind, getSeed, getSeedFamily } from "entropretty-utils"
import { atom } from "jotai"

export type SeedType = FamilyKind

export const editorCodeAtom = atom<string>("")
export const editorCodeVersionAtom = atom<number>(0)
export const editorSeedTypeAtom = atom<SeedType>("Procedural")
export const remixAtom = atom<AlgorithmView | null>(null)
export const scriptErrorAtom = atom<string | null>(null)

export const algorithmNameAtom = atom<string>("")

const initialSeeds = [...getSeedFamily("Procedural").map((s) => [...s])]
export const editorSeedFamilyAtom = atom<number[][]>(initialSeeds)
export const generateNewSeedAtom = atom(null, (get, set) => {
  set(editorSeedFamilyAtom, [
    ...getSeedFamily(get(editorSeedTypeAtom)).map((s) => [...s]),
  ])
})

// Generate a new seed family
export const editorSeedAtom = atom<number[]>([...getSeed("Procedural")])
