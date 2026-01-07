import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useUsersLikes } from "@/hooks/useUsersLikes"
import { AlgorithmView } from "@/lib/helper.types"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowUp } from "lucide-react"
import { useCallback, useMemo } from "react"
import { toast } from "sonner"

interface LikeButtonProps {
  algorithm: AlgorithmView
}

export function LikeButton({ algorithm }: LikeButtonProps) {
  const { user } = useAuth()
  const { data: likesOfUser, isLoading } = useUsersLikes()
  const queryClient = useQueryClient()
  const isLiked = likesOfUser?.includes(algorithm.id)
  const totalLikes = useMemo(() => {
    return algorithm.like_count ?? 0
  }, [algorithm])

  const toggleLike = useCallback(async () => {
    if (!user) return

    const queryKey = ["user-likes", user.id]
    const previousLikes =
      queryClient.getQueryData<AlgorithmView["id"][]>(queryKey) ?? []

    if (!isLiked) {
      // Optimistically add like
      queryClient.setQueryData(queryKey, [...previousLikes, algorithm.id])

      const { error } = await supabase
        .from("likes")
        .insert([{ algorithm_id: algorithm.id!, user_id: user.id }])

      if (error) {
        // Revert optimistic update on error
        queryClient.setQueryData(queryKey, previousLikes)
        console.error("Error liking algorithm:", error)
        toast.error("Error Liking Algorithm: " + error.message)
      }
    } else {
      // Optimistically remove like
      queryClient.setQueryData(
        queryKey,
        previousLikes.filter((id) => id !== algorithm.id),
      )

      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("algorithm_id", algorithm.id!)
        .eq("user_id", user.id)

      if (error) {
        // Revert optimistic update on error
        queryClient.setQueryData(queryKey, previousLikes)
        console.error("Error unliking algorithm:", error)
        toast.error("Error Unliking Algorithm: " + error.message)
      }
    }
  }, [algorithm, user, queryClient, isLiked])

  if (isLoading) return null
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <Button
        variant={"ghost"}
        onClick={toggleLike}
        className={cn({
          "bg-brand-blue hover:bg-brand-blue/80 text-background": isLiked,
          "pointer-events-none": !user || isLoading,
        })}
      >
        <ArrowUp
          className="h-4 w-4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <span className="flex items-center gap-2">
          {/* {user && "LIKE"} */}

          <span className="text-sm">{totalLikes || 0}</span>
        </span>
      </Button>
    </div>
  )
}
