import { AlgorithmRow } from "@/components/AlgorithmRow"
import { useAuth } from "@/contexts/auth-context"
import { useUserIdAlgorithms } from "@/hooks/useUserIdAlgorithms"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Navigate } from "react-router"
import { FeedbackDialog } from "../components/FeedbackDialog"

export default function Mine() {
  const { user } = useAuth()
  const { ref, inView } = useInView()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserIdAlgorithms(user?.id)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  if (!user) {
    return <Navigate to="/login" />
  }

  if (isLoading) {
    return (
      <div className="flex w-full max-w-4xl flex-col gap-4 p-4">Loading...</div>
    )
  }

  return (
    <>
      {user && <FeedbackDialog className="fixed bottom-4 left-4 z-50" />}
      <div className="flex w-full max-w-4xl flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">My Algorithms</h1>
        {data?.pages.map((page) =>
          page.map((algorithm) => (
            <AlgorithmRow key={algorithm.id} algorithm={algorithm} />
          )),
        )}
      </div>

      {/* Loading indicator */}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : hasNextPage ? (
          <div>Load more</div>
        ) : data?.pages[0].length === 0 ? (
          <div className="text-center text-gray-500">
            You haven't created any algorithms yet.
          </div>
        ) : (
          <div>No more algorithms</div>
        )}
      </div>
    </>
  )
}
