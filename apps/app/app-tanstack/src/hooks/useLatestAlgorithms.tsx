import { AlgorithmView } from '@/lib/helper.types'
import { getSupabase } from '@/lib/supabase'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { familyKindFilterAtom } from '@/atoms/family-kind-filter'
import { useAlgorithmServiceSafe } from '@/contexts/service-context'

const PAGE_SIZE = 3

export function useLatestAlgorithms() {
  const familyKindFilter = useAtomValue(familyKindFilterAtom)
  const algorithmService = useAlgorithmServiceSafe()

  return useInfiniteQuery<AlgorithmView[]>({
    queryKey: ['algorithms', 'latest', familyKindFilter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const supabase = getSupabase()
      const from = (pageParam as number) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('algorithms_with_user_profile')
        .select()
        .order('created_at', { ascending: false })

      if (familyKindFilter !== 'All') {
        query = query.eq('family_kind', familyKindFilter)
      }

      const { data, error } = await query.range(from, to)

      if (data !== null && algorithmService) {
        for (const algorithm of data) {
          algorithmService.addAlgorithm(
            algorithm.id!,
            algorithm.content!,
            algorithm.family_kind!,
          )
        }
      }

      if (error) throw error
      return data as AlgorithmView[]
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined
    },
    enabled: typeof window !== 'undefined', // Only run on client
  })
}
