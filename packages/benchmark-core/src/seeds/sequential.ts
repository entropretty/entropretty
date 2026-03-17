import { getSeed, incrementSeed } from "@entropretty/utils"
import type { FamilyKind, Seed } from "@entropretty/utils"
import type { SeedStrategy } from "./types"

export class SequentialStrategy implements SeedStrategy {
  name = "sequential"

  generate(kind: FamilyKind, count: number): Seed[] {
    const seeds: Seed[] = []
    let current = getSeed(kind)

    for (let i = 0; i < count; i++) {
      seeds.push([...current])
      current = incrementSeed(current)
    }

    return seeds
  }
}
