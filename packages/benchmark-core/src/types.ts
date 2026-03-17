import type { AlgorithmId, FamilyKind, Seed } from "@entropretty/utils"
import type {
  CheckMetadata,
  ComplianceRule,
  SingleImageRule,
  ComparisonRule,
  MultiImageRule,
  CodeRule,
  ImagePixelData,
} from "@entropretty/compliance"
import type { SeedStrategy } from "./seeds"
import type { RuleRegistry } from "@entropretty/compliance"

export type QualityTier = "S" | "A" | "B" | "C" | "F"

export interface ComplianceResult {
  imageHash: string
  isCompliant: boolean
  issues: CheckMetadata[]
  ruleTypesFailed: string[]
}

export interface RuleCheckResult {
  ruleName: string
  ruleType: string
  status: "pass" | "warn" | "error" | "info"
  metadata?: CheckMetadata[]
}

export interface RuleAggregateResult {
  ruleName: string
  ruleType: string
  passCount: number
  warnCount: number
  errorCount: number
  sampleMetadata?: CheckMetadata[]
}

export interface BenchmarkResultV1 {
  version: 1
  amount: number
  algorithmId: AlgorithmId
  size: number
  failedTotal: number
  collisionsTotal: number
  errors: number
  warningDistribution: Record<number, number>
  ruleResults: RuleCheckResult[]
  errorMessage?: string
}

export interface BenchmarkResultV2 {
  version: 2
  algorithmId: AlgorithmId
  amount: number
  size: number
  seedStrategy: string
  ruleResults: RuleAggregateResult[]
  failedTotal: number
  collisionsTotal: number
  errors: number
  warningDistribution: Record<number, number>
  errorMessage?: string
}

export type BenchmarkResult = BenchmarkResultV1 | BenchmarkResultV2

export interface ScoredBenchmarkResult extends BenchmarkResultV2 {
  qualityScore: number
  qualityTier: QualityTier
  ruleScores: Record<string, number>
}

export interface BenchmarkOptions {
  algorithmId: AlgorithmId
  algorithm: string
  kind: FamilyKind
  size?: number
  amount?: number
  seedStrategy?: SeedStrategy
  rules?: RuleRegistry
  renderFn: (seed: Seed, size: number) => Promise<ImagePixelData>
  onProgress?: (progress: number) => void
}

// Re-export types from compliance
export type {
  ComplianceRule,
  SingleImageRule,
  ComparisonRule,
  MultiImageRule,
  CodeRule,
  CheckMetadata as ComplianceCheckMetadata,
  ImagePixelData,
}
