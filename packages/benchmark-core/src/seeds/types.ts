import type { FamilyKind, Seed } from "@entropretty/utils"

export interface SeedStrategy {
  name: string
  generate(kind: FamilyKind, count: number): Seed[]
}
