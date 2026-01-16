import { BenchmarkResult } from "@/workers/compliance"
import { WarningDistribution } from "./WarningDistribution"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    <TooltipProvider>
      <div className="border p-4">
        <h3 className="mb-6 text-lg">Benchmark Results</h3>

        {/* Status Overview */}
        <div className="mb-6 space-y-1">
          {/* Collisions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                {benchmarkResult.collisionsTotal === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>no direct collision</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span>
                      found {benchmarkResult.collisionsTotal} identical images *
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              We check if different seeds result in the exact same image. This
              is a critical issue and will lead to disqualification.
            </TooltipContent>
          </Tooltip>

          {/* Errors */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                {benchmarkResult.errors === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>0 errors</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span>{errorPercentage}% of seeds error out*</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                We check if your script throws no errors depending on the input
                seed.
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Warnings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                {benchmarkResult.failedTotal === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>0 warnings</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{warningPercentage}% of seeds have warnings</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              We do our best to analyze the tattooability of your design for
              each image. This measure is by no means perfect. But best to have
              no errors at all.
            </TooltipContent>
          </Tooltip>
        </div>

        {(benchmarkResult.errors > 0 ||
          benchmarkResult.collisionsTotal > 0) && (
          <div className="text-sm text-red-600 dark:text-red-400">
            * Critical issues, please fix them before submitting. Otherwise this
            could lead to disqualification for the ongoing competition.
          </div>
        )}

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
    </TooltipProvider>
  )
}
