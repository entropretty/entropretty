import { Button } from "@/components/ui/button"
import { useAlgorithmService } from "@/contexts/service-context"
import { useCallback, useState } from "react"
import { BenchmarkResult as BenchmarkResultType } from "@/workers/compliance"
import { BenchmarkResults } from "./BenchmarkResults"

export const Benchmarking = () => {
  const algorithmService = useAlgorithmService()
  const [progress, setProgress] = useState(0)
  const [isBenchmarking, setIsBenchmarking] = useState(false)
  const [benchmarkDuration, setBenchmarkDuration] = useState<number | null>(
    null,
  )
  const [benchmarkResult, setBenchmarkResult] =
    useState<BenchmarkResultType | null>(null)

  const doBenchmark = useCallback(
    (size: number, amount: number) => () => {
      setIsBenchmarking(true)
      setBenchmarkDuration(null)
      setBenchmarkResult(null)
      setProgress(0)
      const startTime = performance.now()

      algorithmService
        .benchmark(0, size, amount, (p) => setProgress(p))
        .then((r) => {
          console.log(r)
          setBenchmarkResult(r)
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
      <div className="flex gap-4">
        <Button disabled={isBenchmarking} onClick={doBenchmark(100, 500)}>
          Small Benchmark
        </Button>

        <Button disabled={isBenchmarking} onClick={doBenchmark(250, 1000)}>
          Full Benchmark
        </Button>
      </div>

      {isBenchmarking && (
        <div className="border p-4">
          <div className="mb-4 font-medium">Benchmarking in Progress</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress:</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 w-full border">
              <div
                className="h-2 bg-black transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {benchmarkResult && benchmarkDuration !== null && (
        <BenchmarkResults
          benchmarkResult={benchmarkResult}
          benchmarkDuration={benchmarkDuration}
        />
      )}
    </div>
  )
}
