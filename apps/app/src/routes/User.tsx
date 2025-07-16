import { AlgorithmCard } from "@/components/AlgorithmCard"
import { useUserAlgorithms } from "@/hooks/useUserAlgorithms"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useParams } from "react-router"
import { AlgorithmCardSkeleton } from "@/components/AlgorithmCard/AlgorithmCardSkeleton"

export default function UserPage() {
  const { username } = useParams()
  const { ref, inView } = useInView()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserAlgorithms(username)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  // Redirect if not logged in
  if (!username) {
    return <div>No user with username {username} found</div>
  }

  if (isLoading) {
    return (
      <div className="mx-auto my-4">
        <div className="space-y-4">
          <AlgorithmCardSkeleton />
          <AlgorithmCardSkeleton />
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto my-4">
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
    </div>
  )
}
