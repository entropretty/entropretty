import type { AlgorithmId, FamilyKind, Seed } from "@entropretty/utils"
import type {
  CheckMetadata,
  ComplianceResult as RuleComplianceResult,
  SingleImageRule,
  CodeRule,
} from "@entropretty/compliance/browser"

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

export type BenchmarkResult = BenchmarkResultV1

export interface BenchmarkOptions {
  algorithmId: AlgorithmId
  algorithm: string
  kind: FamilyKind
  size?: number
  amount?: number
  onProgress?: (progress: number) => void
}

export interface ScoredBenchmarkResult extends BenchmarkResult {
  qualityScore: number
}

// Re-export types from compliance
export type ComplianceRule = SingleImageRule | CodeRule
export type ComplianceRuleResult = RuleComplianceResult
export type { CheckMetadata as ComplianceCheckMetadata }
