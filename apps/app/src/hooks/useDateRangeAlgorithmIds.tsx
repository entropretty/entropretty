import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useDateRangeAlgorithmIds(startDate: string, endDate: string) {
  return useQuery<Array<number>>({
    queryKey: ['algorithms', 'ids', 'date-range', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('algorithms_with_user_profile')
        .select('id, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })

      if (error) throw error

      // data is Array<{ id: number | null, created_at: string | null }>
      return (data ?? [])
        .map((row) => row.id)
        .filter((id): id is number => id !== null)
    },
    staleTime: 60 * 1000, // 1 minute
  })
}
