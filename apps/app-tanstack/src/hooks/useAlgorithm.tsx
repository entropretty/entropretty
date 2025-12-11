import { useAlgorithmServiceSafe } from '@/contexts/service-context'
import { AlgorithmView } from '@/lib/helper.types'
import { getSupabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'

export function useAlgorithm(algorithmId: number) {
  const algorithmService = useAlgorithmServiceSafe()

  return useQuery<AlgorithmView>({
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

      if (algorithmService) {
        algorithmService.addAlgorithm(data.id!, data.content!, data.family_kind!)
      }

      return data as AlgorithmView
    },
    staleTime: Infinity,
    enabled: typeof window !== 'undefined',
  })
}
