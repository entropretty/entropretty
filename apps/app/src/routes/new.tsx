import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { AlgorithmCard } from '@/components/AlgorithmCard'
import { AlgorithmCardSkeleton } from '@/components/AlgorithmCard/AlgorithmCardSkeleton'
import { FamilyKindFilter } from '@/components/FamilyKindFilter'
import { FeedbackDialog } from '@/components/FeedbackDialog'
import { useAuth } from '@/contexts/auth-context'
import { useLatestAlgorithms } from '@/hooks/useLatestAlgorithms'

export const Route = createFileRoute('/new')({
  component: NewPage,
  ssr: false, // Client-side only for now
  head: () => ({
    meta: [
      {
        title: 'New - Entropretty',
      },
    ],
  }),
})

function Feed() {
  const { ref, inView } = useInView()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLatestAlgorithms()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <AlgorithmCardSkeleton />
        <AlgorithmCardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page) =>
        page.map((algorithm) => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        )),
      )}

      {/* Loading indicator */}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : hasNextPage ? (
          <div>Load more</div>
        ) : (
          <div>No more algorithms</div>
        )}
      </div>
    </div>
  )
}

function NewPage() {
  const { user } = useAuth()
  return (
    <>
      {user && <FeedbackDialog className="fixed bottom-4 left-4 z-50" />}
      <div className="my-4 w-full sm:mx-auto sm:w-auto">
        <div className="space-y-4 px-4 sm:px-0">
          <FamilyKindFilter />
          <Feed />
        </div>
      </div>
    </>
  )
}
