import { blake2b256 as blake2b256Hasher } from "@multiformats/blake2/blake2b"
import { bytesToHex } from "@noble/hashes/utils.js"
import {
  createBrowserRegistry,
  type RuleRegistry,
} from "@entropretty/compliance"
import type {
  CodeRule,
  SingleImageRule,
  ComparisonRule,
  MultiImageRule,
  ImagePixelData,
} from "@entropretty/compliance"
import { BitFlipStrategy } from "./seeds"
import type { SeedStrategy } from "./seeds"
import type {
  BenchmarkOptions,
  BenchmarkResultV2,
  ComplianceResult,
  RuleAggregateResult,
  RuleCheckResult,
} from "./types"

const BENCHMARK_REFERENCE_SIZE = 300
const BENCHMARK_DEFAULT_AMOUNT = 250

export class BenchmarkCore {
  async benchmark(options: BenchmarkOptions): Promise<BenchmarkResultV2> {
    const {
      algorithmId,
      algorithm,
      kind,
      size = BENCHMARK_REFERENCE_SIZE,
      amount = BENCHMARK_DEFAULT_AMOUNT,
      seedStrategy = new BitFlipStrategy(),
      rules: registry = createBrowserRegistry(),
      renderFn,
      onProgress,
    } = options

    const allRules = registry.getEnabled()

    // Separate rule types
    const codeRules = allRules.filter((r): r is CodeRule => r.type === "code")
    const singleRules = allRules.filter(
      (r): r is SingleImageRule => r.type === "single",
    )
    const comparisonRules = allRules.filter(
      (r): r is ComparisonRule => r.type === "comparison",
    )
    const multiRules = allRules.filter(
      (r): r is MultiImageRule => r.type === "multi",
    )

    // Per-rule aggregate tracking
    const ruleAggregates: Map<string, RuleAggregateResult> = new Map()

    const initAggregate = (name: string, type: string) => {
      if (!ruleAggregates.has(name)) {
        ruleAggregates.set(name, {
          ruleName: name,
          ruleType: type,
          passCount: 0,
          warnCount: 0,
          errorCount: 0,
        })
      }
    }

    const recordResult = (
      name: string,
      type: string,
      result: { status: string; metadata?: unknown[] },
    ) => {
      initAggregate(name, type)
      const agg = ruleAggregates.get(name)!
      if (result.status === "pass") agg.passCount++
      else if (result.status === "warn") agg.warnCount++
      else if (result.status === "error") {
        agg.errorCount++
        // Store first failure sample
        if (!agg.sampleMetadata && result.metadata) {
          agg.sampleMetadata =
            result.metadata as RuleAggregateResult["sampleMetadata"]
        }
      }
    }

    // 1. Check code rules first (fail fast)
    for (const rule of codeRules) {
      const result = await rule.check(algorithm)
      initAggregate(rule.name, "code")
      recordResult(rule.name, "code", result)

      if (result.status === "error") {
        return {
          version: 2,
          amount,
          algorithmId,
          size,
          seedStrategy: seedStrategy.name,
          failedTotal: amount,
          collisionsTotal: 0,
          errors: amount,
          warningDistribution: {},
          ruleResults: Array.from(ruleAggregates.values()),
          errorMessage: result.metadata?.[0]?.message || "Code rule violation",
        }
      }
    }

    // 2. Generate seeds
    const seeds = seedStrategy.generate(kind, amount)

    // 3. Render all seeds and run single-image rules
    const renderedImages: ImagePixelData[] = []
    const hashes: Record<string, number[][]> = {}
    const hashesSet = new Set<string>()
    let checked = 0
    let errors = 0
    const issueCountsPerSeed: number[] = []

    for (const seed of seeds) {
      try {
        const image = await renderFn(seed, size)
        renderedImages.push(image)

        // Hash for collision detection
        const digest = await blake2b256Hasher.digest(image.data)
        const imageHash = bytesToHex(digest.digest)

        // Track collisions
        const dupeSeeds = hashes[imageHash]
        if (dupeSeeds) {
          hashes[imageHash] = [...dupeSeeds, [...seed]]
        } else {
          hashes[imageHash] = [[...seed]]
        }
        hashesSet.add(imageHash)

        // Run single-image rules
        let seedIssueCount = 0
        for (const rule of singleRules) {
          const result = await rule.check(image)
          recordResult(rule.name, "single", result)
          if (result.status !== "pass" && result.metadata) {
            seedIssueCount += result.metadata.length
          }
        }
        issueCountsPerSeed.push(seedIssueCount)
      } catch (error) {
        errors++
        issueCountsPerSeed.push(0)
      }

      checked++
      if (checked % 5 === 0 && onProgress) {
        onProgress(checked / amount)
      }
    }

    // 4. Run comparison rules (all pairs)
    if (comparisonRules.length > 0 && renderedImages.length >= 2) {
      for (const rule of comparisonRules) {
        initAggregate(rule.name, "comparison")
      }
      // Use phash-based O(N) approach for large sets, direct for small
      if (renderedImages.length <= 50) {
        for (let i = 0; i < renderedImages.length; i++) {
          for (let j = i + 1; j < renderedImages.length; j++) {
            for (const rule of comparisonRules) {
              const result = await rule.compare(
                renderedImages[i],
                renderedImages[j],
              )
              recordResult(rule.name, "comparison", result)
            }
          }
        }
      } else {
        // Sample comparison for large sets: compare first image with every Nth
        const step = Math.max(1, Math.floor(renderedImages.length / 50))
        for (let i = 0; i < renderedImages.length; i += step) {
          for (let j = i + step; j < renderedImages.length; j += step) {
            for (const rule of comparisonRules) {
              const result = await rule.compare(
                renderedImages[i],
                renderedImages[j],
              )
              recordResult(rule.name, "comparison", result)
            }
          }
        }
      }
    }

    // 5. Run multi-image rules
    if (multiRules.length > 0 && renderedImages.length > 0) {
      for (const rule of multiRules) {
        const result = await rule.checkMultiple(renderedImages)
        recordResult(rule.name, "multi", result)
      }
    }

    // 6. Post-process
    if (onProgress) {
      onProgress(1)
    }

    // Warning distribution
    const chartData: Record<number, number> = {}
    for (const count of issueCountsPerSeed) {
      chartData[count] = (chartData[count] || 0) + 1
    }

    // Count failed seeds (any seed with issues)
    const failed = issueCountsPerSeed.filter((c) => c > 0).length

    // Collisions
    const collisions = Object.entries(hashes).filter(
      ([, seeds]) => seeds.length > 1,
    )

    if (collisions.length > 0) {
      console.log(`\nFound ${collisions.length} collision(s):`)
      for (const [hash, seeds] of collisions) {
        console.log(`  Hash: ${hash.substring(0, 16)}...`)
        console.log(`  Seeds producing same hash:`)
        for (const seed of seeds) {
          console.log(`    [${seed.slice(0, 8).join(", ")}...]`)
        }
      }
    }

    return {
      version: 2,
      warningDistribution: chartData,
      failedTotal: failed,
      collisionsTotal: collisions.length,
      size,
      amount,
      errors,
      algorithmId,
      seedStrategy: seedStrategy.name,
      ruleResults: Array.from(ruleAggregates.values()),
      errorMessage: errors === amount ? "All iterations failed" : undefined,
    }
  }
}
