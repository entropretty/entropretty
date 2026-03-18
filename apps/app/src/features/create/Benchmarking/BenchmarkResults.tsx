import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { WarningDistribution } from './WarningDistribution'
import type { QualityTier } from '@entropretty/benchmark-core'
import type { BenchmarkResult } from '@/workers/compliance'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface BenchmarkResultsProps {
  benchmarkResult: BenchmarkResult
  benchmarkDuration: number
  qualityScore: number
  qualityTier: QualityTier
  ruleScores: Record<string, number>
}

const tierColors: Record<QualityTier, string> = {
  S: 'text-purple-600 dark:text-purple-400 border-purple-600',
  A: 'text-green-600 dark:text-green-400 border-green-600',
  B: 'text-blue-600 dark:text-blue-400 border-blue-600',
  C: 'text-yellow-600 dark:text-yellow-400 border-yellow-600',
  F: 'text-red-600 dark:text-red-400 border-red-600',
}

export const BenchmarkResults = ({
  benchmarkResult,
  benchmarkDuration,
  qualityScore,
  qualityTier,
  ruleScores,
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

        {/* Quality Score */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center border-2 text-2xl font-bold ${tierColors[qualityTier]}`}
          >
            {qualityTier}
          </div>
          <div>
            <div className="text-2xl font-bold">{qualityScore}/100</div>
            <div className="text-muted-foreground text-sm">Quality Score</div>
          </div>
        </div>

        {/* Per-rule breakdown */}
        {benchmarkResult.ruleResults.length > 0 && (
          <div className="mb-6 space-y-2">
            <div className="text-sm font-medium">Rule Breakdown</div>
            <div className="space-y-1">
              {benchmarkResult.ruleResults.map((rule) => {
                const score = ruleScores[rule.ruleName] ?? 100
                const total = rule.passCount + rule.warnCount + rule.errorCount
                return (
                  <div
                    key={rule.ruleName}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {rule.ruleName}
                    </span>
                    <span>
                      {rule.errorCount > 0 ? (
                        <span className="text-red-600 dark:text-red-400">
                          {rule.errorCount} errors
                        </span>
                      ) : rule.warnCount > 0 ? (
                        <span className="text-yellow-600 dark:text-yellow-400">
                          {rule.warnCount} warnings
                        </span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400">
                          {rule.passCount}/{total} passed
                        </span>
                      )}{' '}
                      ({score}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
                {benchmarkResult.size}x{benchmarkResult.size}px
              </span>
            </div>
            <div className="flex justify-between">
              <span>Seed Strategy:</span>
              <span>{benchmarkResult.seedStrategy}</span>
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
