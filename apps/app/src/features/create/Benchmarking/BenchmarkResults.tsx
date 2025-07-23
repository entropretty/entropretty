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

  const getSuccessPercentage = (result: BenchmarkResult) => {
    return ((result.amount - result.failedTotal) / result.amount) * 100
  }

  return (
    <div className="border p-4">
      <div className="mb-6 font-medium">Benchmark Results</div>
      <div className="space-y-6">
        {/* Main Results */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="border p-4 text-center">
            <div className="text-2xl font-bold">
              {getSuccessPercentage(benchmarkResult).toFixed(1)}%
            </div>
            <div className="text-sm">Success Rate</div>
          </div>

          <div className="border p-4 text-center">
            <div className="text-2xl font-bold">
              {benchmarkResult.failedTotal}
            </div>
            <div className="text-sm">Failed Tests</div>
          </div>

          <div className="border p-4 text-center">
            <div className="text-2xl font-bold">
              {benchmarkResult.amount - benchmarkResult.failedTotal}
            </div>
            <div className="text-sm">Passed Tests</div>
          </div>
        </div>

        {/* Failed Percentage */}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>Failed Percentage:</span>
            <span className="font-medium">
              {(
                (benchmarkResult.failedTotal / benchmarkResult.amount) *
                100
              ).toFixed(2)}
              %
            </span>
          </div>
        </div>

        {/* Visual Success Rate Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Compliance Success Rate</span>
            <span>{getSuccessPercentage(benchmarkResult).toFixed(1)}%</span>
          </div>
          <div className="h-3 w-full border">
            <div
              className="h-3 bg-black transition-all duration-500"
              style={{ width: `${getSuccessPercentage(benchmarkResult)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>0%</span>
            <span>100%</span>
          </div>
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
                {Math.round(
                  (benchmarkResult.amount / benchmarkDuration) * 1000,
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
