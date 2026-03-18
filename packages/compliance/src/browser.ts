// Re-export from unified rules for backwards compatibility
export { colorCountRule } from "./rules/color-count"
export { colorIslandsRule } from "./rules/color-islands"
export { exampleCodeRule } from "./rules/example-code"
export type {
  BaseRule,
  CheckStatus,
  CheckMetadata,
  ComplianceResult,
  SingleImageRule,
  ComparisonRule,
  MultiImageRule,
  CodeRule,
  ComplianceRule,
  ImagePixelData,
} from "./types"
