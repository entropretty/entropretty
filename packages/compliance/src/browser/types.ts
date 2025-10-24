// Base interface for all rules
export interface BaseRule {
  name: string
  description: string
}

// Different possible outcomes for a check
export type CheckStatus = "pass" | "warn" | "error" | "info"

// Metadata for warnings and errors
export interface CheckMetadata {
  message: string
  details?: Record<string, unknown>
  location?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface ComplianceResult {
  status: CheckStatus
  metadata?: CheckMetadata[]
  type?: string // Identifies which check produced this result (e.g. "colorCount", "colorIsland")
}

// For rules that check a single image
export interface SingleImageRule extends BaseRule {
  type: "single"
  check: (image: ArrayBuffer) => Promise<ComplianceResult>
}

// For rules that compare two images
export interface ComparisonRule extends BaseRule {
  type: "comparison"
  compare: (
    baseImage: ArrayBuffer,
    compareImage: ArrayBuffer,
  ) => Promise<ComplianceResult>
}

// For rules that work with multiple images
export interface MultiImageRule extends BaseRule {
  type: "multi"
  checkMultiple: (images: ArrayBuffer[]) => Promise<ComplianceResult>
}

// For rules that check source code
export interface CodeRule extends BaseRule {
  type: "code"
  check: (code: string) => Promise<ComplianceResult>
}

// Union type for all possible rules
export type ComplianceRule =
  | SingleImageRule
  | ComparisonRule
  | MultiImageRule
  | CodeRule
