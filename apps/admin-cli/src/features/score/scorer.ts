import {
  BenchmarkCore,
  scoreBenchmarkResult,
} from "@entropretty/benchmark-core"
import {
  createServerRegistry,
  type ImagePixelData,
} from "@entropretty/compliance"
import { RenderCore } from "@entropretty/utils"
import type { Algorithm, AlgorithmScore } from "../../lib/supabase"
import { upsertAlgorithmScore } from "./queries"

const BENCHMARK_SIZE = 300
const BENCHMARK_AMOUNT = 250
const RENDER_TIMEOUT_MS = 300

export async function scoreAlgorithm(
  algorithm: Algorithm,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; score?: number; error?: string }> {
  try {
    const renderCore = new RenderCore(RENDER_TIMEOUT_MS)
    renderCore.updateAlgorithm(
      algorithm.id,
      algorithm.content,
      algorithm.family_kind,
    )

    const registry = createServerRegistry()
    const benchmarkCore = new BenchmarkCore()

    const result = await benchmarkCore.benchmark({
      algorithmId: algorithm.id,
      algorithm: algorithm.content,
      kind: algorithm.family_kind,
      size: BENCHMARK_SIZE,
      amount: BENCHMARK_AMOUNT,
      rules: registry,
      renderFn: async (seed, size) => {
        const imageData = await renderCore.renderImageData(
          algorithm.id,
          size,
          seed,
        )
        return {
          data: new Uint8Array(imageData.data.buffer),
          width: imageData.width,
          height: imageData.height,
        } as ImagePixelData
      },
      onProgress,
    })

    const scoredResult = scoreBenchmarkResult(result)

    const algorithmScore: AlgorithmScore = {
      algorithm_id: algorithm.id,
      quality_score: scoredResult.qualityScore,
      benchmark_results: result,
    }

    await upsertAlgorithmScore(algorithmScore)

    if (result.errors === result.amount) {
      console.log(
        `\n  Warning: All ${result.amount} iterations failed with errors`,
      )
    }

    return {
      success: true,
      score: scoredResult.qualityScore,
    }
  } catch (error) {
    console.error("\n  Error details:", error)

    if (error instanceof Error && error.message.includes("Runtime error")) {
      const algorithmScore: AlgorithmScore = {
        algorithm_id: algorithm.id,
        quality_score: 0,
        benchmark_results: {
          version: 2,
          amount: BENCHMARK_AMOUNT,
          algorithmId: algorithm.id,
          size: BENCHMARK_SIZE,
          seedStrategy: "bit-flip",
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

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
