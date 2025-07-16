import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "react-router"
import { AlgorithmDemo } from "../components/AlgorithmDemo"
import { useAlgorithm } from "../hooks/useAlgorithm"

export default function DemoPage() {
  const { algorithmId } = useParams()

  const { data: algorithm, isLoading } = useAlgorithm(Number(algorithmId))

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
        <Skeleton className={`aspect-square h-[70vh] w-[70vh]`} />
      </div>
    )
  }

  if (!algorithm) {
    return <div>Algorithm not found</div>
  }

  return (
    <div className="flex h-screen w-screen cursor-none flex-col items-center justify-center bg-black">
      <AlgorithmDemo algorithm={algorithm} />
    </div>
  )
}
