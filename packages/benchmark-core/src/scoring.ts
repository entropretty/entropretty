import type {
  BenchmarkResult,
  BenchmarkResultV2,
  ScoredBenchmarkResult,
  QualityTier,
  RuleAggregateResult,
} from "./types"

interface TierThresholds {
  S: number
  A: number
  B: number
  C: number
}

const DEFAULT_THRESHOLDS: TierThresholds = {
  S: 95,
  A: 80,
  B: 60,
  C: 40,
}

export function calculateTier(
  score: number,
  thresholds: TierThresholds = DEFAULT_THRESHOLDS,
): QualityTier {
  if (score >= thresholds.S) return "S"
  if (score >= thresholds.A) return "A"
  if (score >= thresholds.B) return "B"
  if (score >= thresholds.C) return "C"
  return "F"
}

function calculateRuleScore(agg: RuleAggregateResult): number {
  const total = agg.passCount + agg.warnCount + agg.errorCount
  if (total === 0) return 100
  // Errors count double against score
  const penalty = (agg.warnCount + agg.errorCount * 2) / total
  return Math.max(0, Math.round((1 - penalty) * 100))
}

/**
 * Calculate quality score from benchmark results using exponential curve
 *
 * Rules:
 * - Any collisions or errors -> score = 0
 * - 0% warnings -> score = 100
 * - ~5% warnings -> score = ~80
 * - ~15% warnings -> score = ~30
 * - Uses exponential decay curve
 */
export function calculateQualityScore(result: BenchmarkResult): number {
  if (result.collisionsTotal > 0 || result.errors > 0) {
    return 0
  }

  const totalWarnings = Object.entries(result.warningDistribution)
    .filter(([issueCount]) => parseInt(issueCount) > 0)
    .reduce((sum, [, count]) => sum + count, 0)

  const warningPercentage = (totalWarnings / result.amount) * 100

  if (warningPercentage === 0) {
    return 100
  }

  const k = 0.15
  const baseScore = 10
  const maxBonus = 90
  const score = baseScore + maxBonus * Math.exp(-k * warningPercentage)

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function scoreBenchmarkResult(
  result: BenchmarkResultV2,
): ScoredBenchmarkResult {
  const qualityScore = calculateQualityScore(result)
  const qualityTier = calculateTier(qualityScore)

  const ruleScores: Record<string, number> = {}
  for (const agg of result.ruleResults) {
    ruleScores[agg.ruleName] = calculateRuleScore(agg)
  }

  return {
    ...result,
    qualityScore,
    qualityTier,
    ruleScores,
  }
}

// Backwards-compatible wrapper
export function addQualityScore(
  result: BenchmarkResult,
): BenchmarkResult & { qualityScore: number } {
  return {
    ...result,
    qualityScore: calculateQualityScore(result),
  }
}
