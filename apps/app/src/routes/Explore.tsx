import { EntroprettyLogo } from "@/components/EntroprettyLogo"
import { GalleryAlgorithm } from "@/components/GalleryAlgorithm"
import { useCallback, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router"
import { useQueryAlgorithmIds } from "../hooks/useQueryAlgorithmIds"

export function ExploreGallery() {
  const [algorithmIds, setAlgorithmIds] = useState<number[]>([])
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Start loading more content before reaching the bottom
  })

  const { data: availableAlgorithmIds } = useQueryAlgorithmIds()
  console.log({ algorithmIds, availableAlgorithmIds })

  useEffect(() => {
    if (!availableAlgorithmIds) return

    const initialSet = new Array(128).fill(1).map(() => {
      const randomIndex = Math.floor(
        Math.random() * availableAlgorithmIds.length,
      )
      return availableAlgorithmIds[randomIndex]
    })
    setAlgorithmIds(initialSet)
  }, [availableAlgorithmIds])

  const loadMore = useCallback(() => {
    if (!availableAlgorithmIds) return
    const newSet = new Array(64).fill(1).map(() => {
      const randomIndex = Math.floor(
        Math.random() * availableAlgorithmIds.length,
      )
      return availableAlgorithmIds[randomIndex]
    })

    setAlgorithmIds((prev) => [...prev, ...newSet])
  }, [availableAlgorithmIds])

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
