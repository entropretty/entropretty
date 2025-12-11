import { useAlgorithm } from "../hooks/useAlgorithm"

import { AlgorithmCard } from "./AlgorithmCardNext"
import { AlgorithmCardSkeleton } from "./AlgorithmCardNext/AlgorithmCardSkeleton"

interface GalleryAlgorithmProps {
  algorithmId: number
  /** Number of seed variations to display (default: 4) */
  seedCount?: number
}

export const GalleryAlgorithm = ({ algorithmId }: GalleryAlgorithmProps) => {
  const { data: algorithm, isLoading } = useAlgorithm(algorithmId)

  if (isLoading) {
    return <AlgorithmCardSkeleton />
  }

  return <AlgorithmCard algorithm={algorithm!} />
}
