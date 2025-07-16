import { useAlgorithmService } from "@/contexts/service-context"
import { AlgorithmView } from "@/lib/helper.types"
import { supabase } from "@/lib/supabase"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { familyKindFilterAtom } from "@/atoms/family-kind-filter"

const PAGE_SIZE = 3

export function useGalleryAlgorithms() {
  const algorithmService = useAlgorithmService()
  const familyKindFilter = useAtomValue(familyKindFilterAtom)

  return useInfiniteQuery<AlgorithmView[]>({
    queryKey: ["algorithms", "gallery", familyKindFilter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from("algorithms_with_user_profile")
        .select()
        .order("random()", { ascending: true })

      if (familyKindFilter !== "All") {
        query = query.eq("family_kind", familyKindFilter)
      }

      const { data, error } = await query.range(from, to)

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
