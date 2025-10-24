import { BenchmarkCore, addQualityScore } from "@entropretty/benchmark-core"
import type { Algorithm, AlgorithmScore } from "./supabase"
import { upsertAlgorithmScore } from "./database"

// Import compliance rules
// Note: We need browser rules since we're using canvas/OffscreenCanvas
import {
  colorIslandsRule,
  exampleCodeRule,
} from "@entropretty/compliance/browser"

const BENCHMARK_SIZE = 300
const BENCHMARK_AMOUNT = 250

export async function scoreAlgorithm(
  algorithm: Algorithm,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; score?: number; error?: string }> {
  try {
    // Create benchmark instance
    const benchmark = new BenchmarkCore(300)
    benchmark.addRule(colorIslandsRule)
    benchmark.addRule(exampleCodeRule)

    // Run benchmark
    const result = await benchmark.benchmark({
      algorithmId: algorithm.id,
      algorithm: algorithm.content,
      kind: algorithm.family_kind,
      size: BENCHMARK_SIZE,
      amount: BENCHMARK_AMOUNT,
      onProgress,
    })

    // Calculate quality score
    const scoredResult = addQualityScore(result)

    // Store in database with full versioned results
    const algorithmScore: AlgorithmScore = {
      algorithm_id: algorithm.id,
      quality_score: scoredResult.qualityScore,
      benchmark_results: result, // Store complete versioned result
    }

    await upsertAlgorithmScore(algorithmScore)

    // Debug: log if all failed
    if (result.errors === result.amount) {
      console.log(
        `\n  ⚠ Warning: All ${result.amount} iterations failed with errors`,
      )
    }

    return {
      success: true,
      score: scoredResult.qualityScore,
    }
  } catch (error) {
    // Log the full error for debugging
    console.error("\n  Error details:", error)

    // If it's an execution error (algorithm fails), store 0 score
    if (error instanceof Error && error.message.includes("Runtime error")) {
      const algorithmScore: AlgorithmScore = {
        algorithm_id: algorithm.id,
        quality_score: 0,
        benchmark_results: {
          version: 1,
          amount: BENCHMARK_AMOUNT,
          algorithmId: algorithm.id,
          size: BENCHMARK_SIZE,
          failedTotal: BENCHMARK_AMOUNT,
          collisionsTotal: 0,
          errors: BENCHMARK_AMOUNT,
          warningDistribution: {},
          ruleResults: [],
          errorMessage: error.message,
        },
      }

      await upsertAlgorithmScore(algorithmScore)

      return {
        success: true,
        score: 0,
      }
    }

    // For retrieval/network errors, don't store anything
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
