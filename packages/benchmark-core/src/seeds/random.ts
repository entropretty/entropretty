import type { FamilyKind, Seed } from "@entropretty/utils"
import type { SeedStrategy } from "./types"

const SEED_LENGTHS: Record<FamilyKind, number> = {
  Procedural: 4,
  ProceduralPersonal: 8,
  ProceduralAccount: 32,
}

function randomSeed(length: number): Seed {
  return Array.from({ length }, () => Math.floor(Math.random() * 256))
}

export class RandomStrategy implements SeedStrategy {
  name = "random"

  generate(kind: FamilyKind, count: number): Seed[] {
    const length = SEED_LENGTHS[kind]
    const seeds: Seed[] = []
    const seen = new Set<string>()

    while (seeds.length < count) {
      const seed = randomSeed(length)
      const key = seed.join(",")
      if (!seen.has(key)) {
        seen.add(key)
        seeds.push(seed)
      }
    }

    return seeds
  }
}
