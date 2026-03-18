import { getSeedFamily } from "@entropretty/utils"
import type { FamilyKind, Seed } from "@entropretty/utils"
import type { SeedStrategy } from "./types"

export class BitFlipStrategy implements SeedStrategy {
  name = "bit-flip"

  generate(kind: FamilyKind, count: number): Seed[] {
    return getSeedFamily(kind, count)
  }
}
