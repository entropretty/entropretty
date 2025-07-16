import { useAlgorithmService } from "@/contexts/service-context"
import { AlgorithmView } from "@/lib/helper.types"
import { supabase } from "@/lib/supabase"
import { useInfiniteQuery } from "@tanstack/react-query"

const PAGE_SIZE = 3

export function useUserIdAlgorithms(userId: string | undefined) {
  const algorithmService = useAlgorithmService()

  return useInfiniteQuery<AlgorithmView[]>({
    queryKey: ["algorithms", "user-id", userId],
    enabled: !!userId,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error } = await supabase
        .from("algorithms_with_user_profile")
        .select()
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (data) {
        for (const algorithm of data) {
          algorithmService.addAlgorithm(algorithm.id!, algorithm.content!)
        }
      }

      if (error) throw error
      return data as AlgorithmView[]
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined
    },
  })
}
