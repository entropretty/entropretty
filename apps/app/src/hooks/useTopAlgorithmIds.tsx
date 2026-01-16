import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useTopAlgorithmIds() {
  return useQuery<Array<number>>({
    queryKey: ['algorithms', 'ids', 'top-scored'],
    queryFn: async () => {
      // Query algorithm_scores table directly and join to get algorithm details
      const { data, error } = await supabase
        .from('algorithm_scores')
        .select(
          'algorithm_id, quality_score, algorithms_with_user_profile!inner(id)',
        )
        .order('quality_score', { ascending: false })
        .order('algorithm_id', { ascending: false }) // tie-breaker: descending algorithm ID

      if (error) throw error

      // Extract algorithm IDs from the result
      return (data ?? [])
        .map((row) => row.algorithm_id)
        .filter((id): id is number => id !== null)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - scores don't change often
  })
}
