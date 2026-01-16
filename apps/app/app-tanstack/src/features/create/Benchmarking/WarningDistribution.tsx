import { BenchmarkResult } from "@/workers/compliance"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"

interface WarningDistributionProps {
  warningDistribution: BenchmarkResult["warningDistribution"]
}

export const WarningDistribution = ({
  warningDistribution,
}: WarningDistributionProps) => {
  // Transform and process the data
  const processedData = () => {
    const entries = Object.entries(warningDistribution).map(
      ([warnings, count]) => ({
        warnings: parseInt(warnings, 10),
        count: count as number,
      }),
    )

    // Group warnings 10+ into "More than 9" category
    const groupedData = new Map<number, number>()

    entries.forEach(({ warnings, count }) => {
      const key = warnings >= 10 ? 10 : warnings
      groupedData.set(key, (groupedData.get(key) || 0) + count)
    })

    // Convert back to array and sort
    const chartData = Array.from(groupedData.entries())
      .map(([warnings, count]) => ({
        warnings,
        count,
        label: warnings >= 10 ? "10+" : warnings.toString(),
        fill: warnings === 0 ? "hsl(142, 76%, 36%)" : "hsl(var(--foreground))",
      }))
      .sort((a, b) => a.warnings - b.warnings)

    // Separate the "10+" category from the regular ones
    const regularData = chartData.filter((item) => item.warnings < 10)
    const tenPlusData = chartData.find((item) => item.warnings === 10)

    // Ensure at least 5 entries for 0-9 range (pad with 0 counts if needed)
    const maxRegularWarnings = Math.max(
      4,
      Math.max(...regularData.map((item) => item.warnings), 0),
    )
    const paddedData = []

    for (let i = 0; i <= Math.min(maxRegularWarnings, 9); i++) {
      const existing = regularData.find((item) => item.warnings === i)
      if (existing) {
        paddedData.push(existing)
      } else {
        paddedData.push({
          warnings: i,
          count: 0,
          label: i.toString(),
          fill: i === 0 ? "hsl(142, 76%, 36%)" : "hsl(var(--foreground))",
        })
      }
    }

    // Add the "10+" category if it exists
    if (tenPlusData) {
      paddedData.push(tenPlusData)
    }

    return paddedData
  }

  const chartData = processedData()

  // Chart configuration
  const chartConfig = {
    count: {
      label: "Tests",
      color: "hsl(var(--foreground))",
    },
  }

  if (chartData.length === 0) {
    return (
      <div className="border p-4">
        <div className="mb-4 font-medium">Warning Distribution</div>
        <div className="text-muted-foreground text-sm">
          No warning data available
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center pr-4">
      <div className="mb-4 py-4 text-sm font-medium">
        Distribution of Warnings
      </div>

      <ChartContainer
        config={chartConfig}
        className="max-h-[400px] min-h-[200px]"
      >
        <BarChart
          data={chartData}
          margin={{
            top: 4,
            right: 4,
            left: 4,
            bottom: 4,
          }}
          // barSize={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={2}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, _name, props) => {
                  const warnings = props?.payload?.warnings
                  if (warnings === undefined) return [`${value} tests`, "Tests"]

                  let warningText
                  if (warnings >= 10) {
                    warningText = "10+ warnings"
                  } else if (warnings === 1) {
                    warningText = "1 warning"
                  } else {
                    warningText = `${warnings} warnings`
                  }

                  return [`${value} outputs have ${warningText}`, ""]
                }}
                hideLabel={true}
              />
            }
          />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
