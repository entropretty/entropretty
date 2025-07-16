import { FamilyKind } from "entropretty-utils"
import { atomWithStorage } from "jotai/utils"

export const familyKindFilterAtom = atomWithStorage<FamilyKind | "All">(
  "familyKindFilter",
  "All",
)
