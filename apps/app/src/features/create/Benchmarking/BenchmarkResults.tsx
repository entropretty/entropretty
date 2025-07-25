import { BenchmarkResult } from "@/workers/compliance"
import { WarningDistribution } from "./WarningDistribution"

interface BenchmarkResultsProps {
  benchmarkResult: BenchmarkResult
  benchmarkDuration: number
}

export const BenchmarkResults = ({
  benchmarkResult,
  benchmarkDuration,
}: BenchmarkResultsProps) => {
  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  const warningPercentage = Math.round(
    (benchmarkResult.failedTotal / benchmarkResult.amount) * 100,
  )
  const errorPercentage = Math.round(
    (benchmarkResult.errors / benchmarkResult.amount) * 100,
  )

  return (
    <div className="border p-4">
      <div className="mb-6 font-medium">Benchmark Results</div>

      {/* Status Overview */}
      <div className="mb-6 space-y-1">
        {/* Collisions */}
        {benchmarkResult.collisionsTotal === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span>✅</span>
            <span>no direct collision</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <span>⚠️</span>
            <span>
              found {benchmarkResult.collisionsTotal} identical images
            </span>
          </div>
        )}

        {/* Errors */}
        {benchmarkResult.errors === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span>✅</span>
            <span>no errors</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <span>⚠️</span>
            <span>{errorPercentage}% of seeds error out</span>
          </div>
        )}
        {/* Warnings */}
        {benchmarkResult.failedTotal === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span>✅</span>
            <span>0 warnings</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <span>⚠️</span>
            <span>{warningPercentage}% of seeds have warnings</span>
          </div>
        )}
      </div>

      {/* Warning Distribution Chart */}
      <WarningDistribution
        warningDistribution={benchmarkResult.warningDistribution}
      />

      {/* Benchmark Details (for debugging) */}
      <div className="text-muted-foreground space-y-2 border-t pt-4">
        <div className="text-xs font-medium">Benchmark Details</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Total Tests:</span>
            <span>{benchmarkResult.amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Image Size:</span>
            <span>
              {benchmarkResult.size}×{benchmarkResult.size}px
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Duration:</span>
            <span>{formatDuration(benchmarkDuration)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tests/Second:</span>
            <span>
              {Math.round((benchmarkResult.amount / benchmarkDuration) * 1000)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
