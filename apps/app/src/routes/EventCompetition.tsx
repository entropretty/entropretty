/**
 * EventCompetition - Generic event gallery component for displaying algorithms within date ranges
 *
 * Available routes:
 * - /event/winter-assembly-2025  (Jan 1 - Feb 3, 2025)
 * - /event/summer-assembly-2025  (Jun 1 - Aug 3, 2025)
 * - /event/revision-2025         (Feb 4 - Apr 21, 2025)
 */

import { EntroprettyLogo } from "@/components/EntroprettyLogo"
import { getSeed, seedToKey } from "@entropretty/utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Link, useParams } from "react-router"
import { Skeleton } from "../components/ui/skeleton"
import { AlgorithmBitmap } from "../features/create/AlgorithmBitmap"
import { useAlgorithm } from "../hooks/useAlgorithm"
import { useDisplaySizes } from "../hooks/useDisplaySizes"
import { useDateRangeAlgorithmIds } from "../hooks/useDateRangeAlgorithmIds"

interface EventCompetitionGalleryProps {
  title: string
  startDate: string
  endDate: string
}

export function EventCompetitionGallery({
  title,
  startDate,
  endDate,
}: EventCompetitionGalleryProps) {
  const [algorithmIds, setAlgorithmIds] = useState<number[]>([])
  const [displayedIds, setDisplayedIds] = useState<number[]>([])
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Start loading more content before reaching the bottom
  })

  const { data: availableAlgorithmIds, isLoading } = useDateRangeAlgorithmIds(
    startDate,
    endDate,
  )

  useEffect(() => {
    if (!availableAlgorithmIds) return
    setAlgorithmIds(availableAlgorithmIds)

    // Load initial batch
    const initialBatch = availableAlgorithmIds.slice(0, 64)
    setDisplayedIds(initialBatch)
  }, [availableAlgorithmIds])

  const loadMore = useCallback(() => {
    if (!algorithmIds.length) return

    const currentLength = displayedIds.length
    const nextBatch = algorithmIds.slice(currentLength, currentLength + 32)

    if (nextBatch.length > 0) {
      setDisplayedIds((prev) => [...prev, ...nextBatch])
    }
  }, [algorithmIds, displayedIds.length])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  if (isLoading) {
    return (
      <div className="relative flex flex-col">
        <div className="p-8">
          <h1 className="mb-8 text-center text-3xl font-bold">{title}</h1>
          <div className="text-center text-gray-600">Loading algorithms...</div>
        </div>
      </div>
    )
  }

  if (!availableAlgorithmIds || availableAlgorithmIds.length === 0) {
    return (
      <div className="relative flex flex-col">
        <div className="p-8">
          <h1 className="mb-8 text-center text-3xl font-bold">{title}</h1>
          <div className="text-center text-gray-600">
            No algorithms found for the specified date range.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col">
      <div className="p-8">
        <h1 className="mb-2 text-center text-3xl font-bold">{title}</h1>
        <p className="mb-8 text-center text-gray-600">
          Showing {availableAlgorithmIds.length} algorithms from{" "}
          {new Date(startDate).toLocaleDateString()} to{" "}
          {new Date(endDate).toLocaleDateString()}
        </p>
      </div>

      <div className={`relative flex w-full flex-col`}>
        <div className="h-full w-full p-4">
          <div className="mx-auto flex w-full flex-wrap items-center justify-evenly gap-4 sm:gap-10">
            {displayedIds.map((id, index) => (
              <GalleryAlgorithm key={`${id}-${index}`} algorithmId={id} />
            ))}
            {/* Loading trigger */}
            {displayedIds.length < algorithmIds.length && (
              <div ref={ref} className="h-4 w-full" />
            )}
          </div>
        </div>
        <Link to="/hot">
          <div className="bg-background border-background-200 fixed bottom-0 right-0 flex w-auto items-center justify-center gap-8 gap-y-2 border px-8 py-4 sm:pb-4">
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
      <div className="bg-background/80 border-background-200 absolute bottom-0 left-0 right-16 flex h-full w-full items-center justify-center gap-2 border p-4 pb-8 text-xs text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:pb-4 sm:text-sm">
        {`${algorithm?.name}`}
        <br /> {`by ${algorithm?.username}`}
      </div>
    </Link>
  )
}

// Generic parameterized component for events
export default function EventCompetitionPage() {
  const params = useParams()

  // Event configurations for different competitions
  const eventConfig = {
    "summer-assembly-2025": {
      title: "Summer Assembly 2025",
      startDate: "2025-06-01T00:00:00Z",
      endDate: "2025-08-03T23:59:59Z",
    },
    "winter-assembly-2025": {
      title: "Winter Assembly 2025",
      startDate: "2025-01-01T00:00:00Z",
      endDate: "2025-02-03T23:59:59Z",
    },
    "revision-2025": {
      title: "Revision 2025",
      startDate: "2025-02-04T00:00:00Z",
      endDate: "2025-04-21T23:59:59Z",
    },
  }

  const eventId = params.eventId as keyof typeof eventConfig
  const config = eventConfig[eventId]

  if (!config) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Event Not Found</h1>
        <p className="text-gray-600">The event "{eventId}" was not found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <EventCompetitionGallery
        title={config.title}
        startDate={config.startDate}
        endDate={config.endDate}
      />
    </div>
  )
}
