import { createFileRoute } from '@tanstack/react-router'
import { AlgorithmDemo } from '@/components/AlgorithmDemo'
import { Skeleton } from '@/components/ui/skeleton'
import { useAlgorithm } from '@/hooks/useAlgorithm'

export const Route = createFileRoute('/demo/$algorithmId')({
  component: DemoPage,
})

function DemoPage() {
  const { algorithmId } = Route.useParams()

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
    <div className="flex h-screen w-screen cursor-none flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-4 bg-white p-4">
        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center overflow-visible">
          <AlgorithmDemo
            algorithm={algorithm}
            className="demo-flex-responsive !p-1"
          />
        </div>
      </div>
    </div>
  )
}

