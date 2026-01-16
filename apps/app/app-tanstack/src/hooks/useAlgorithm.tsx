import { useAlgorithmServiceSafe } from '@/contexts/service-context'
import { AlgorithmView } from '@/lib/helper.types'
import { getSupabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useAlgorithm(algorithmId: number) {
  const algorithmService = useAlgorithmServiceSafe()

  const query = useQuery<AlgorithmView>({
    queryKey: ['algorithm', algorithmId],
    queryFn: async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('algorithms_with_user_profile')
        .select()
        .eq('id', algorithmId)
        .single()

      if (error) throw error
      if (!data) throw new Error('Algorithm not found')

      return data as AlgorithmView
    },
    staleTime: Infinity,
    enabled: typeof window !== 'undefined',
  })

  // Register algorithm with service when both data and service are available
  // This handles the case where service loads after the query completes
  useEffect(() => {
    if (algorithmService && query.data) {
      algorithmService.addAlgorithm(
        query.data.id!,
        query.data.content!,
        query.data.family_kind!,
      )
    }
  }, [algorithmService, query.data])

  return query
}
