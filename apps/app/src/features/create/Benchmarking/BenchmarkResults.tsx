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

  return (
    <div className="border p-4">
      <div className="mb-6 font-medium">Benchmark Results</div>
      <div className="space-y-6">
        {/* Test Results */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total Tested:</span>
            <span>{benchmarkResult.amount}</span>
          </div>
          <div className="flex justify-between">
            <span>0 Warnings:</span>
            <span>{benchmarkResult.warningDistribution[0] || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>At Least 1 Warning:</span>
            <span>{benchmarkResult.failedTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Warnings:</span>
            <span>
              {Object.entries(benchmarkResult.warningDistribution).reduce(
                (total, [warnings, count]) =>
                  total + parseInt(warnings) * count,
                0,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Collisions:</span>
            <span>{benchmarkResult.collisionsTotal}</span>
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
