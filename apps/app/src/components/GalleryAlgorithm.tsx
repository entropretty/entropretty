import { getSeed, seedToKey } from "entropretty-utils"
import { useMemo } from "react"
import { Link } from "react-router"
import { Skeleton } from "./ui/skeleton"
import { AlgorithmBitmap } from "../features/create/AlgorithmBitmap"
import { useAlgorithm } from "../hooks/useAlgorithm"
import { useDisplaySizes } from "../hooks/useDisplaySizes"

interface GalleryAlgorithmProps {
  algorithmId: number
  /** Number of seed variations to display (default: 4) */
  seedCount?: number
}

export const GalleryAlgorithm = ({
  algorithmId,
  seedCount = 4,
}: GalleryAlgorithmProps) => {
  const { data: algorithm, isLoading } = useAlgorithm(algorithmId)
  const { infinite } = useDisplaySizes()

  const seeds = useMemo(() => {
    if (!algorithm) return []
    const family = Array.from({ length: seedCount }, () =>
      getSeed(algorithm.family_kind!),
    )
    return family as number[][]
  }, [algorithm, seedCount])

  if (isLoading) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <>
      {seeds.map((seed) => (
        <Link
          key={seedToKey(seed)}
          to={`/a/${algorithmId}`}
          className="group relative group-hover:border"
        >
          <AlgorithmBitmap
            algorithmId={algorithmId}
            seed={seed as number[]}
            size={infinite}
            scale={2}
          />
          <div className="absolute bottom-[-16px] left-0 right-16 z-50 flex w-full items-center justify-center gap-2 border bg-white px-3 py-2 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {`${algorithm?.name}`}
            <br /> {`by ${algorithm?.username}`}
          </div>
        </Link>
      ))}
    </>
  )
}
