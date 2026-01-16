import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { AlgorithmView } from '@/lib/helper.types'
import { getSupabase } from '@/lib/supabase'

export function useUsersLikes() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['user-likes', user?.id],
    queryFn: async () => {
      if (!user) return []

      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      return data.map((like) => like.algorithm_id)
    },
    enabled: !!user && typeof window !== 'undefined',
  })
}
