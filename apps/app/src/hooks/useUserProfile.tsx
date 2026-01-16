import { useQuery } from '@tanstack/react-query'
import type { Profile } from '@/lib/helper.types'
import { useAuth } from '@/contexts/auth-context'
import { getSupabase } from '@/lib/supabase'

export function useUserProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')

      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!user && typeof window !== 'undefined',
  })
}
