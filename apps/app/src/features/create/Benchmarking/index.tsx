import { Button } from "@/components/ui/button"
import { useAlgorithmService } from "@/contexts/service-context"
import { useState } from "react"

export const Benchmarking = () => {
  const algorithmService = useAlgorithmService()
  const [progress, setProgress] = useState(0)
  const [isBenchmarking, setIsBenchmarking] = useState(false)
  const [benchmarkDuration, setBenchmarkDuration] = useState<number | null>(
    null,
  )

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

  const handleBenchmark = () => {
    setIsBenchmarking(true)
    setBenchmarkDuration(null)
    const startTime = performance.now()

    algorithmService
      .benchmark(0, 200, 200, (p) => setProgress(p))
      .then((r) => {
        console.log(r)
      })
      .finally(() => {
        const endTime = performance.now()
        const duration = endTime - startTime
        setBenchmarkDuration(duration)
        setIsBenchmarking(false)
      })
  }

  return (
    <div>
      <Button disabled={isBenchmarking} onClick={handleBenchmark}>
        Small Benchmark
      </Button>
      <div>Progress: {progress}</div>
      {benchmarkDuration !== null && (
        <div>Benchmark completed in: {formatDuration(benchmarkDuration)}</div>
      )}
    </div>
  )
}
