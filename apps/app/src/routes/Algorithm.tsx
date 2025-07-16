import { AlgorithmInfiniteGrid } from "@/components/AlgorithmInfiniteGrid"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "react-router"
import { useAlgorithm } from "../hooks/useAlgorithm"
import { useDisplaySizes } from "../hooks/useDisplaySizes"

export default function AlgorithmPage() {
  const { algorithmId } = useParams()

  const { infinite } = useDisplaySizes()

  const { data: algorithm, isLoading } = useAlgorithm(Number(algorithmId))

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex flex-col gap-4 p-0 sm:p-8">
          <div className="mx-auto flex w-full flex-wrap items-center justify-evenly gap-4 sm:gap-16">
            {Array(48)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  style={{ width: infinite, height: infinite }}
                  className={`aspect-square rounded-none`}
                />
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (!algorithm) {
    return <div>Algorithm not found</div>
  }

  return (
    <div className="flex flex-col gap-4 p-0 sm:p-8">
      <AlgorithmInfiniteGrid algorithm={algorithm} />
    </div>
  )
}
