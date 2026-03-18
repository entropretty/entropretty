import { useCallback, useState } from 'react'
import { scoreBenchmarkResult } from '@entropretty/benchmark-core'
import { BenchmarkResults } from './BenchmarkResults'
import type { ScoredBenchmarkResult } from '@entropretty/benchmark-core'
import type { BenchmarkResult as BenchmarkResultType } from '@/workers/compliance'
import { useAlgorithmService } from '@/contexts/service-context'
import { Button } from '@/components/ui/button'

export const Benchmarking = () => {
  const algorithmService = useAlgorithmService()
  const [progress, setProgress] = useState(0)
  const [isBenchmarking, setIsBenchmarking] = useState(false)
  const [benchmarkDuration, setBenchmarkDuration] = useState<number | null>(
    null,
  )
  const [scoredResult, setScoredResult] =
    useState<ScoredBenchmarkResult | null>(null)

  const doBenchmark = useCallback(
    (size: number, amount: number) => () => {
      setIsBenchmarking(true)
      setBenchmarkDuration(null)
      setScoredResult(null)
      setProgress(0)
      const startTime = performance.now()

      algorithmService
        .benchmark(0, size, amount, (p) => setProgress(p))
        .then((r) => {
          setScoredResult(scoreBenchmarkResult(r))
        })
        .finally(() => {
          const endTime = performance.now()
          const duration = endTime - startTime
          setBenchmarkDuration(duration)
          setIsBenchmarking(false)
        })
    },
    [algorithmService],
  )

  return (
    <div className="space-y-6">
      <div className="border border-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
        <p className="text-xs text-blue-800 dark:text-blue-400">
          This benchmark is meant to help you and us determine how well suited
          your algorithm is for tattooing. Our automated checks are not flawless
          and will improve over time.
        </p>
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Button disabled={isBenchmarking} onClick={doBenchmark(250, 250)}>
          Quick Benchmark
        </Button>

        <Button disabled={isBenchmarking} onClick={doBenchmark(250, 1000)}>
          Big Benchmark
        </Button>
      </div>

      {isBenchmarking && (
        <div className="border p-4">
          <div className="bg-background relative flex h-8 w-full items-center border">
            <div
              className="bg-foreground h-8 transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background text-foreground p-1 text-xs">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {scoredResult && benchmarkDuration !== null && (
        <BenchmarkResults
          benchmarkResult={scoredResult}
          benchmarkDuration={benchmarkDuration}
          qualityScore={scoredResult.qualityScore}
          qualityTier={scoredResult.qualityTier}
          ruleScores={scoredResult.ruleScores}
        />
      )}
    </div>
  )
}
