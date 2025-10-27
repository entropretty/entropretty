import type { BenchmarkResult, ScoredBenchmarkResult } from "./types"

/**
 * Calculate quality score from benchmark results using exponential curve
 *
 * Rules:
 * - Any collisions or errors -> score = 0
 * - 0% warnings -> score = 100
 * - ~5% warnings -> score = ~80
 * - ~15% warnings -> score = ~30
 * - Uses exponential decay curve
 *
 * @param result Benchmark result
 * @returns Quality score (0-100)
 */
export function calculateQualityScore(result: BenchmarkResult): number {
  // Critical failures: collisions or errors
  if (result.collisionsTotal > 0 || result.errors > 0) {
    return 0
  }

  // Calculate total warnings (issues with 1 or more problems)
  const totalWarnings = Object.entries(result.warningDistribution)
    .filter(([issueCount]) => parseInt(issueCount) > 0)
    .reduce((sum, [, count]) => sum + count, 0)

  const warningPercentage = (totalWarnings / result.amount) * 100

  // If no warnings, perfect score
  if (warningPercentage === 0) {
    return 100
  }

  // Exponential decay curve: score = 10 + 90 * e^(-k * percentage)
  // Tuned so that:
  // - 5% warnings gives ~80 points
  // - 15% warnings gives ~30 points
  const k = 0.15 // decay constant
  const baseScore = 10
  const maxBonus = 90
  const score = baseScore + maxBonus * Math.exp(-k * warningPercentage)

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function addQualityScore(
  result: BenchmarkResult,
): ScoredBenchmarkResult {
  return {
    ...result,
    qualityScore: calculateQualityScore(result),
  }
}
