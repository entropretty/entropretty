import { GalleryAlgorithm } from "@/components/GalleryAlgorithm"
import { useCallback, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useTopAlgorithmIds } from "../hooks/useTopAlgorithmIds"

export function ExploreGallery() {
  const [algorithmIds, setAlgorithmIds] = useState<number[]>([])
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Start loading more content before reaching the bottom
  })

  const { data: availableAlgorithmIds } = useTopAlgorithmIds()
  console.log({ algorithmIds, availableAlgorithmIds })

  useEffect(() => {
    if (!availableAlgorithmIds) return

    // Take the top 128 algorithms by score (no randomization)
    const initialSet = availableAlgorithmIds.slice(0, 128)
    setAlgorithmIds(initialSet)
  }, [availableAlgorithmIds])

  const loadMore = useCallback(() => {
    if (!availableAlgorithmIds) return

    const currentCount = algorithmIds.length
    const nextBatch = availableAlgorithmIds.slice(
      currentCount,
      currentCount + 64,
    )

    if (nextBatch.length > 0) {
      setAlgorithmIds((prev) => [...prev, ...nextBatch])
    }
  }, [availableAlgorithmIds, algorithmIds.length])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  return (
    <div className="mx-auto my-4">
      <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 lg:grid-cols-3">
        {algorithmIds.map((id, index) => (
          <GalleryAlgorithm key={`${id}-${index}`} algorithmId={id} />
        ))}
        {/* Loading trigger */}
        <div ref={ref} className="h-4 w-full" />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col">
      <ExploreGallery />
    </div>
  )
}
