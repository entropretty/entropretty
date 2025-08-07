/**
 * Event - Generic event gallery component for displaying algorithms within date ranges
 *
 * Available routes:
 * - /event/winter-assembly-2025  (Jan 1 - Feb 3, 2025)
 * - /event/summer-assembly-2025  (Jun 1 - Aug 3, 2025)
 * - /event/revision-2025         (Feb 4 - Apr 21, 2025)
 */

import { EntroprettyLogo } from "@/components/EntroprettyLogo"
import { GalleryAlgorithm } from "@/components/GalleryAlgorithm"
import { useCallback, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Link, useParams } from "react-router"
import { useDateRangeAlgorithmIds } from "../hooks/useDateRangeAlgorithmIds"

interface EventGalleryProps {
  title: string
  queryStartDate: string
  queryEndDate: string
  eventStartDate: string
  eventEndDate: string
  headerImage?: string
  website?: string
}

export function EventGallery({
  title,
  queryStartDate,
  queryEndDate,
  eventStartDate,
  eventEndDate,
  headerImage,
  website,
}: EventGalleryProps) {
  const [algorithmIds, setAlgorithmIds] = useState<number[]>([])
  const [displayedIds, setDisplayedIds] = useState<number[]>([])
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Start loading more content before reaching the bottom
  })

  const { data: availableAlgorithmIds, isLoading } = useDateRangeAlgorithmIds(
    queryStartDate,
    queryEndDate,
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
        {headerImage && (
          <div className="mb-6 flex justify-center">
            <img
              src={headerImage}
              alt={`${title} Logo`}
              className="h-24 w-auto object-contain"
            />
          </div>
        )}
        <p className="mb-4 text-center text-gray-600">
          {new Date(eventStartDate).toLocaleDateString()} to{" "}
          {new Date(eventEndDate).toLocaleDateString()}
        </p>
        <p className="mb-8 text-center text-sm text-gray-500">
          Showing {availableAlgorithmIds.length} algorithms from the extended
          submission period
        </p>
        {website && (
          <div className="mb-6 text-center">
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Event Website
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>

      <div className={`relative flex w-full flex-col`}>
        <div className="h-full w-full p-4">
          <div className="mx-auto flex w-full flex-wrap items-center justify-evenly gap-2">
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

// Event configuration - shared between Event page and Events index
export const eventConfig = {
  "summer-assembly-2025": {
    title: "Summer Assembly 2025",
    // Query dates for algorithm filtering (extended period)
    queryStartDate: "2025-06-01T00:00:00Z",
    queryEndDate: "2025-08-03T23:59:59Z",
    // Actual event dates for display
    eventStartDate: "2025-07-31T00:00:00Z",
    eventEndDate: "2025-08-03T23:59:59Z",
    headerImage: "/assets/assembly-summer-2025-logo-640w-black-clean.png",
    description: "The premier summer demoparty experience",
    website: "https://assembly.org/en/events/summer25",
  },
  "winter-assembly-2025": {
    title: "Winter Assembly 2025",
    // Query dates for algorithm filtering (extended period)
    queryStartDate: "2025-01-01T00:00:00Z",
    queryEndDate: "2025-02-23T23:59:59Z",
    // Actual event dates for display
    eventStartDate: "2025-02-20T00:00:00Z",
    eventEndDate: "2025-02-23T23:59:59Z",
    headerImage: "/assets/assembly-winter-2025-logo-640w-black-clean.png",
    description: "Kicking off the new year with creative coding",
    website: "https://assembly.org/en/events/winter25",
  },
  "revision-2025": {
    title: "Revision 2025",
    // Query dates for algorithm filtering (extended period)
    queryStartDate: "2025-02-24T00:00:00Z",
    queryEndDate: "2025-04-21T23:59:59Z",
    // Actual event dates for display
    eventStartDate: "2025-04-18T00:00:00Z",
    eventEndDate: "2025-04-21T23:59:59Z",
    headerImage: "/assets/revision-2025-logo.png",
    description: "The legendary Easter demoparty",
    website: "https://2025.revision-party.net/",
  },
}

// Generic parameterized component for events
export default function EventPage() {
  const params = useParams()

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
      <EventGallery
        title={config.title}
        queryStartDate={config.queryStartDate}
        queryEndDate={config.queryEndDate}
        eventStartDate={config.eventStartDate}
        eventEndDate={config.eventEndDate}
        headerImage={config.headerImage}
        website={config.website}
      />
    </div>
  )
}
