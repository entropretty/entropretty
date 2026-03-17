import type { FamilyKind, Seed } from "@entropretty/utils"
import type { SeedStrategy } from "./types"

interface WeightedStrategy {
  strategy: SeedStrategy
  weight: number
}

export class MixedStrategy implements SeedStrategy {
  name = "mixed"
  private strategies: WeightedStrategy[]

  constructor(strategies: WeightedStrategy[]) {
    this.strategies = strategies
  }

  generate(kind: FamilyKind, count: number): Seed[] {
    const totalWeight = this.strategies.reduce((s, w) => s + w.weight, 0)
    const seeds: Seed[] = []
    const seen = new Set<string>()

    for (const { strategy, weight } of this.strategies) {
      const portion = Math.round((weight / totalWeight) * count)
      const generated = strategy.generate(kind, portion)
      for (const seed of generated) {
        const key = seed.join(",")
        if (!seen.has(key)) {
          seen.add(key)
          seeds.push(seed)
        }
      }
    }

    // Fill any remaining slots from the first strategy
    if (seeds.length < count && this.strategies.length > 0) {
      const extra = this.strategies[0].strategy.generate(
        kind,
        count - seeds.length + 10,
      )
      for (const seed of extra) {
        if (seeds.length >= count) break
        const key = seed.join(",")
        if (!seen.has(key)) {
          seen.add(key)
          seeds.push(seed)
        }
      }
    }

    return seeds.slice(0, count)
  }
}
