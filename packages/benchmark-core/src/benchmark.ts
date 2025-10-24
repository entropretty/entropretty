import { blake2b256 as blake2b256Hasher } from "@multiformats/blake2/blake2b"
import { bytesToHex } from "@noble/hashes/utils"
import { RenderCore, getSeedFamily } from "@entropretty/utils"
import type { CheckMetadata, CodeRule } from "@entropretty/compliance/browser"
import type {
  BenchmarkOptions,
  BenchmarkResult,
  ComplianceResult,
  ComplianceRule,
  RuleCheckResult,
} from "./types"

const BENCHMARK_REFERENCE_SIZE = 300
const BENCHMARK_DEFAULT_AMOUNT = 250

export class BenchmarkCore {
  private renderCore: RenderCore
  private rules: ComplianceRule[] = []

  constructor(timeoutMs: number = 300) {
    this.renderCore = new RenderCore(timeoutMs)
  }

  addRule(rule: ComplianceRule) {
    this.rules.push(rule)
  }

  setRules(rules: ComplianceRule[]) {
    this.rules = rules
  }

  async benchmark(options: BenchmarkOptions): Promise<BenchmarkResult> {
    const {
      algorithmId,
      algorithm,
      kind,
      size = BENCHMARK_REFERENCE_SIZE,
      amount = BENCHMARK_DEFAULT_AMOUNT,
      onProgress,
    } = options

    // Separate code rules from image rules
    const codeRules = this.rules.filter((r): r is CodeRule => r.type === "code")
    const imageRules = this.rules.filter((r) => r.type !== "code")
    const allRuleResults: RuleCheckResult[] = []

    // Check code rules first (before rendering loop)
    for (const rule of codeRules) {
      const result = await rule.check(algorithm)
      allRuleResults.push({
        ruleName: rule.name,
        ruleType: "code",
        status: result.status,
        metadata: result.metadata,
      })

      // If code rule fails critically, return immediately
      if (result.status === "error") {
        return {
          version: 1,
          amount,
          algorithmId,
          size,
          failedTotal: amount,
          collisionsTotal: 0,
          errors: amount,
          warningDistribution: {},
          ruleResults: allRuleResults,
          errorMessage: result.metadata?.[0]?.message || "Code rule violation",
        }
      }
    }

    // Update algorithm in render core
    this.renderCore.updateAlgorithm(algorithmId, algorithm, kind)

    // Generate seeds for the family
    const seeds = getSeedFamily(kind, amount)

    const results: ComplianceResult[] = []
    const hashes: Record<string, number[][]> = {}
    const hashesSet: Set<string> = new Set()
    let checked = 0
    let errors = 0

    for (const seed of seeds) {
      try {
        const { compliance, ruleResults } = await this.checkCompliance(
          algorithmId,
          seed,
          size,
          imageRules,
        )
        results.push(compliance)

        // Collect rule results from first iteration for aggregate reporting
        if (checked === 0) {
          allRuleResults.push(...ruleResults)
        }

        const dupeSeeds = hashes[compliance.imageHash]
        if (dupeSeeds) {
          hashes[compliance.imageHash] = [...dupeSeeds, [...seed]]
        } else {
          hashes[compliance.imageHash] = [[...seed]]
        }
        if (!hashesSet.has(compliance.imageHash)) {
          hashesSet.add(compliance.imageHash)
        }
      } catch (error) {
        errors++
      }

      checked++
      if (checked % 5 === 0 && onProgress) {
        onProgress(checked / amount)
      }
    }

    // Post-process
    if (onProgress) {
      onProgress(1)
    }

    const failed = results.filter((r) => !r.isCompliant).length
    const chartData: Record<number, number> = {}
    for (const result of results) {
      const amountOfIssues = result.issues.length
      if (chartData[amountOfIssues]) {
        chartData[amountOfIssues]++
      } else {
        chartData[amountOfIssues] = 1
      }
    }

    const collisions = Object.entries(hashes).filter(
      ([, seeds]) => seeds.length > 1,
    )

    // Log collision details for debugging
    if (collisions.length > 0) {
      console.log(`\n🔍 Found ${collisions.length} collision(s):`)
      for (const [hash, seeds] of collisions) {
        console.log(`  Hash: ${hash.substring(0, 16)}...`)
        console.log(`  Seeds producing same hash:`)
        for (const seed of seeds) {
          console.log(`    [${seed.slice(0, 8).join(", ")}...]`)
        }
      }
    }

    return {
      version: 1,
      warningDistribution: chartData,
      failedTotal: failed,
      collisionsTotal: collisions.length,
      size,
      amount,
      errors,
      algorithmId,
      ruleResults: allRuleResults,
      errorMessage: errors === amount ? "All iterations failed" : undefined,
    }
  }

  private async checkCompliance(
    algorithmId: number,
    seed: number[],
    size: number,
    imageRules: ComplianceRule[],
  ): Promise<{ compliance: ComplianceResult; ruleResults: RuleCheckResult[] }> {
    // Render the image data
    const imageData = await this.renderCore.renderImageData(
      algorithmId,
      size,
      seed,
    )

    // Create a proper ArrayBuffer from the image data
    const buffer = new ArrayBuffer(imageData.data.length)
    new Uint8Array(buffer).set(imageData.data)

    const digest = await blake2b256Hasher.digest(new Uint8Array(buffer))
    const imageHash = bytesToHex(digest.digest)

    // Run all image compliance rules
    const ruleResults = await Promise.all(
      imageRules.map((rule) =>
        rule.type === "single" ? rule.check(buffer) : null,
      ),
    )

    // Extract all issues from rule results
    const issues: ComplianceResult["issues"] = []
    let isCompliant = true
    const rulesWithIssues = new Set<string>()
    const ruleCheckResults: RuleCheckResult[] = []

    for (let i = 0; i < imageRules.length; i++) {
      const rule = imageRules[i]
      const result = ruleResults[i]

      if (result) {
        ruleCheckResults.push({
          ruleName: rule.name,
          ruleType: rule.type,
          status: result.status,
          metadata: result.metadata,
        })

        if (result.status !== "pass" && result.metadata) {
          issues.push(...result.metadata)
          isCompliant = false
          rulesWithIssues.add(rule.type)
        }
      }
    }

    return {
      compliance: {
        isCompliant,
        imageHash,
        issues,
        ruleTypesFailed: Array.from(rulesWithIssues),
      },
      ruleResults: ruleCheckResults,
    }
  }
}
