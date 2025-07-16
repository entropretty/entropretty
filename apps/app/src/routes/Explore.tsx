import { EntroprettyLogo } from "@/components/EntroprettyLogo"
import { getSeed, seedToKey } from "entropretty-utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router"
import { Skeleton } from "../components/ui/skeleton"
import { AlgorithmBitmap } from "../features/create/AlgorithmBitmap"
import { useAlgorithm } from "../hooks/useAlgorithm"
import { useDisplaySizes } from "../hooks/useDisplaySizes"
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
    console.log({ newSet })
    setAlgorithmIds((prev) => [...prev, ...newSet])
  }, [availableAlgorithmIds])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  return (
    <div className="relative flex flex-col">
      <div className={`relative flex w-full flex-col`}>
        <div className="h-full w-full p-4">
          <div className="mx-auto flex w-full flex-wrap items-center justify-evenly gap-4 sm:gap-10">
            {algorithmIds.map((id) => (
              <GalleryAlgorithm algorithmId={id} />
            ))}
            {/* Loading trigger */}
            <div ref={ref} className="h-4 w-full" />
          </div>
        </div>
        <Link to="/hot">
          <div className="bg-background fixed bottom-0 right-0 flex w-auto items-center justify-center gap-8 gap-y-2 border border-gray-200 px-8 py-4 sm:pb-4">
            <EntroprettyLogo />
          </div>
        </Link>
      </div>
    </div>
  )
}

const GalleryAlgorithm = ({ algorithmId }: { algorithmId: number }) => {
  const { data: algorithm, isLoading } = useAlgorithm(algorithmId)
  const { infinite } = useDisplaySizes()
  const seed = useMemo(() => {
    if (!algorithm) return []
    return getSeed(algorithm.family_kind!)
  }, [algorithm])

  if (isLoading) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <Link to={`/a/${algorithmId}`} className="group relative">
      <AlgorithmBitmap
        key={seedToKey(seed)}
        algorithmId={algorithmId}
        seed={seed as number[]}
        size={infinite * 1.5}
        scale={2}
      />
      <div className="bg-background/80 absolute bottom-0 left-0 right-16 flex h-full w-full items-center justify-center gap-2 border border-gray-200 p-4 pb-8 text-xs text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:pb-4 sm:text-sm">
        {`${algorithm?.name}`}
        <br /> {`by ${algorithm?.username}`}
      </div>
    </Link>
  )
}

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col">
      <ExploreGallery />
    </div>
  )
}
