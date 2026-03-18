import { describe, it, expect } from "vitest"
import {
  calculateQualityScore,
  calculateTier,
  scoreBenchmarkResult,
} from "../scoring"
import type { BenchmarkResultV2 } from "../types"

function makeResult(
  overrides: Partial<BenchmarkResultV2> = {},
): BenchmarkResultV2 {
  return {
    version: 2,
    algorithmId: 1,
    amount: 100,
    size: 300,
    seedStrategy: "bit-flip",
    ruleResults: [],
    failedTotal: 0,
    collisionsTotal: 0,
    errors: 0,
    warningDistribution: { 0: 100 },
    ...overrides,
  }
}

describe("calculateQualityScore", () => {
  it("returns 100 for perfect results", () => {
    const result = makeResult()
    expect(calculateQualityScore(result)).toBe(100)
  })

  it("returns 0 for results with collisions", () => {
    const result = makeResult({ collisionsTotal: 1 })
    expect(calculateQualityScore(result)).toBe(0)
  })

  it("returns 0 for results with errors", () => {
    const result = makeResult({ errors: 5 })
    expect(calculateQualityScore(result)).toBe(0)
  })

  it("decreases with more warnings (5%)", () => {
    const result = makeResult({
      warningDistribution: { 0: 95, 1: 5 },
    })
    const score = calculateQualityScore(result)
    expect(score).toBeGreaterThan(40)
    expect(score).toBeLessThan(70)
  })

  it("decreases further with 15% warnings", () => {
    const result = makeResult({
      warningDistribution: { 0: 85, 1: 15 },
    })
    const score = calculateQualityScore(result)
    expect(score).toBeGreaterThan(10)
    expect(score).toBeLessThan(30)
  })
})

describe("calculateTier", () => {
  it("returns S for score >= 95", () => {
    expect(calculateTier(100)).toBe("S")
    expect(calculateTier(95)).toBe("S")
  })

  it("returns A for score >= 80", () => {
    expect(calculateTier(80)).toBe("A")
    expect(calculateTier(94)).toBe("A")
  })

  it("returns B for score >= 60", () => {
    expect(calculateTier(60)).toBe("B")
    expect(calculateTier(79)).toBe("B")
  })

  it("returns C for score >= 40", () => {
    expect(calculateTier(40)).toBe("C")
    expect(calculateTier(59)).toBe("C")
  })

  it("returns F for score < 40", () => {
    expect(calculateTier(0)).toBe("F")
    expect(calculateTier(39)).toBe("F")
  })
})

describe("scoreBenchmarkResult", () => {
  it("returns scored result with tier and rule scores", () => {
    const result = makeResult({
      ruleResults: [
        {
          ruleName: "color-islands",
          ruleType: "single",
          passCount: 90,
          warnCount: 10,
          errorCount: 0,
        },
      ],
    })
    const scored = scoreBenchmarkResult(result)
    expect(scored.qualityScore).toBe(100)
    expect(scored.qualityTier).toBe("S")
    expect(scored.ruleScores["color-islands"]).toBeDefined()
    expect(scored.ruleScores["color-islands"]).toBeLessThanOrEqual(100)
  })
})
